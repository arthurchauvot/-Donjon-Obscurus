let story = {};
let currentId = localStorage.getItem("currentId") || "start";

// Chargement de l'histoire
fetch("story.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(scene => { story[scene.id] = scene; });
    afficherScene(currentId);
  })
  .catch(err => {
    console.error("Erreur lors du chargement de story.json :", err);
    document.getElementById("texte").innerText = "Impossible de charger le jeu.";
  });

// Fonction pour afficher une scène
function afficherScene(id) {
  const scene = story[id];
  if (!scene) return;

  currentId = id;
  localStorage.setItem("currentId", id);

  // Titre et sous-titre
  document.title = scene.titre || "Escape Game";
  document.getElementById("page-title").innerText = scene.titre || "Escape Game";
  document.getElementById("chapitre-title").innerText = scene.chapitre || "";

  // Texte
  const texteDiv = document.getElementById("texte");
  texteDiv.innerText = scene.texte || "";
  // Couleur et style du texte
  texteDiv.style.color = scene.couleurTexte || "#000000";
  texteDiv.style.fontStyle = scene.styleTexte === "italic" ? "italic" : "normal";
  texteDiv.style.fontWeight = scene.styleTexte === "bold" ? "bold" : "normal";
  if(scene.styleTexte && scene.styleTexte.startsWith("font:")){
    texteDiv.style.fontFamily = scene.styleTexte.replace("font:", "");
  } else {
    texteDiv.style.fontFamily = "Arial, sans-serif";
  }

  // Fond ou image
  if (scene.imageBackground) {
    document.body.style.backgroundImage = `url(${scene.imageBackground})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = scene.couleur || "#ffffff";
  }

  // Boutons de choix
  const choixDiv = document.getElementById("choix");
  choixDiv.innerHTML = "";
  for (let i = 1; i <= 2; i++) {
    const label = scene["choix" + i];
    const cible = scene["cible" + i];
    if (label && cible) {
      const btn = document.createElement("button");
      btn.innerText = label;
      if (scene.styleBouton === "rounded") btn.classList.add("rounded");
      btn.onclick = () => afficherScene(cible);
      choixDiv.appendChild(btn);
    }
  }
}

// QR code scanner en temps réel
document.getElementById("scanBtn").onclick = () => {
  const qrReader = new Html5Qrcode("qr-reader");
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      const qrId = qrCodeMessage.replace("QR:", "");
      if (story[qrId]) {
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
