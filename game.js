let gameData = [];
let currentSceneId = localStorage.getItem("currentSceneId") || null;
let currentChapter = null;
let scenesMap = {};

// Chargement du JSON
fetch("story.json")
  .then(res => res.json())
  .then(data => {
    gameData = data;

    // Crée un map des scènes pour accès rapide
    gameData.forEach(chap => {
      chap.scenes.forEach(scene => {
        scenesMap[scene.id] = { ...scene, chapitreId: chap.chapitreId, setup: chap.SETUP };
      });
    });

    // Si aucune scène sauvegardée, prendre la première scène du premier chapitre
    if (!currentSceneId) {
      currentSceneId = gameData[0].scenes[0].id;
    }

    afficherScene(currentSceneId);
  })
  .catch(err => {
    console.error("Erreur chargement story.json :", err);
    document.getElementById("texte").innerText = "Impossible de charger le jeu.";
  });

// Affichage d’une scène
function afficherScene(sceneId) {
  const scene = scenesMap[sceneId];
  if (!scene) return;

  currentSceneId = sceneId;
  localStorage.setItem("currentSceneId", sceneId);

  const setup = scene.setup;

  // Mise à jour du chapitre courant
  currentChapter = setup;

  // Titre et sous-titre
  document.title = setup.titre || "Escape Game";
  const pageTitle = document.getElementById("page-title");
  const chapitreTitle = document.getElementById("chapitre-title");
  pageTitle.innerText = setup.titre || "Escape Game";
  pageTitle.style.color = setup.couleurTitre || "#000";
  pageTitle.style.fontWeight = setup.styleTitre === "bold" ? "bold" : "normal";
  pageTitle.style.fontStyle = setup.styleTitre === "italic" ? "italic" : "normal";

  chapitreTitle.innerText = setup.sousTitre || "";
  chapitreTitle.style.color = setup.couleurSousTitre || "#666";
  chapitreTitle.style.fontWeight = setup.styleSousTitre === "bold" ? "bold" : "normal";
  chapitreTitle.style.fontStyle = setup.styleSousTitre === "italic" ? "italic" : "normal";

  // Texte
  const texteDiv = document.getElementById("texte");
  texteDiv.innerText = scene.texte || "";
  texteDiv.style.color = setup.couleurTexte || "#000";
  texteDiv.style.fontWeight = setup.styleTexte === "bold" ? "bold" : "normal";
  texteDiv.style.fontStyle = setup.styleTexte === "italic" ? "italic" : "normal";

  // Fond
  if (setup.imageFond) {
    document.body.style.backgroundImage = `url(${setup.imageFond})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = setup.couleurFond || "#fff";
  }

  // Boutons de choix dynamiques
  const choixDiv = document.getElementById("choix");
  choixDiv.innerHTML = "";
  scene.choix.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.label;
    if (setup.styleBouton === "rounded") btn.classList.add("rounded");
    btn.onclick = () => afficherScene(c.cible);
    choixDiv.appendChild(btn);
  });
}

// QR code scanner en temps réel
document.getElementById("scanBtn").onclick = () => {
  const qrReader = new Html5Qrcode("qr-reader");
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      const qrId = qrCodeMessage.replace("QR:", "");
      if (scenesMap[qrId]) {
        afficherScene(qrId);
        qrReader.stop();
        document.getElementById("qr-reader").innerHTML = "";
      } else {
        alert("QR code inconnu : " + qrId);
      }
    },
    errorMessage => {}
  ).catch(err => {
    console.error("Impossible de démarrer le scan QR", err);
    alert("Impossible d'accéder à la caméra pour scanner le QR code.");
  });
};
