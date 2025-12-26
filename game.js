let scenesMap = {};
let currentSceneId = localStorage.getItem("currentSceneId") || null;
let journal = JSON.parse(localStorage.getItem("journal")) || [];

/* ==========================
   CHARGEMENT DU JSON
========================== */

fetch("story.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(chapitre => {
      chapitre.scenes.forEach(scene => {
        scenesMap[scene.id] = {
          ...scene,
          setup: chapitre.SETUP
        };
      });
    });

    if (!currentSceneId) {
      currentSceneId = Object.keys(scenesMap)[0];
    }

    afficherScene(currentSceneId);
  })
  .catch(err => {
    console.error(err);
    document.getElementById("texte").innerText = "Erreur de chargement du jeu.";
  });

/* ==========================
   AFFICHAGE D’UNE SCÈNE
========================== */

function afficherScene(id) {
  const scene = scenesMap[id];
  if (!scene) return;

  currentSceneId = id;
  localStorage.setItem("currentSceneId", id);

  const setup = scene.setup;

  /* --- Titres --- */
  document.title = setup.titre || "Escape Game";

  const titre = document.getElementById("page-title");
  titre.innerText = setup.titre || "";
  titre.style.color = setup.couleurTitre || "#000";
  titre.style.fontWeight = setup.styleTitre === "bold" ? "bold" : "normal";
  titre.style.fontStyle = setup.styleTitre === "italic" ? "italic" : "normal";

  const sousTitre = document.getElementById("chapitre-title");
  sousTitre.innerText = setup.sousTitre || "";
  sousTitre.style.color = setup.couleurSousTitre || "#555";
  sousTitre.style.fontWeight = setup.styleSousTitre === "bold" ? "bold" : "normal";
  sousTitre.style.fontStyle = setup.styleSousTitre === "italic" ? "italic" : "normal";

  /* --- Texte --- */
  const texteDiv = document.getElementById("texte");
  texteDiv.innerText = scene.texte || "";
  texteDiv.style.color = setup.couleurTexte || "#000";
  texteDiv.style.fontWeight = setup.styleTexte === "bold" ? "bold" : "normal";
  texteDiv.style.fontStyle = setup.styleTexte === "italic" ? "italic" : "normal";

  /* --- Fond --- */
  if (setup.imageFond) {
    document.body.style.backgroundImage = `url(${setup.imageFond})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  } else {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = setup.couleurFond || "#fff";
  }

  /* --- Choix --- */
  const choixDiv = document.getElementById("choix");
  choixDiv.innerHTML = "";

  scene.choix.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.label;
    btn.onclick = () => afficherScene(c.cible);
    choixDiv.appendChild(btn);
  });

  /* --- Journal automatique --- */
   if (scene.journal) {
     scene.journal.forEach(entry => {
       const exists = journal.some(j =>
         j.texte === entry.texte && j.image === entry.image
       );
       if (!exists) {
         journal.push(entry);
       }
     });
     localStorage.setItem("journal", JSON.stringify(journal));
   }

}

/* ==========================
   JOURNAL
========================== */

document.getElementById("journalBtn").onclick = () => {
  const content = document.getElementById("journalContent");
  content.innerHTML = "";

  journal.forEach((j, i) => {
    const p = document.createElement("p");
    p.innerText = `${i + 1}. ${j}`;
    content.appendChild(p);
  });

  document.getElementById("journalOverlay").style.display = "block";
};

document.getElementById("closeJournal").onclick = () => {
  document.getElementById("journalOverlay").style.display = "none";
};

/* ==========================
   CODES SECRETS
========================== */

document.getElementById("codeBtn").onclick = () => {
  const code = document.getElementById("codeInput").value.trim();
  const scene = scenesMap[currentSceneId];

  if (!scene.codes) {
    alert("Aucun code ici.");
    return;
  }

  const found = scene.codes.find(c => c.code === code);
  if (found) {
    afficherScene(found.cible);
    document.getElementById("codeInput").value = "";
  } else {
    alert("Code incorrect");
  }
};

/* ==========================
   SCAN QR CODE
========================== */

document.getElementById("scanBtn").onclick = () => {
  const reader = new Html5Qrcode("qr-reader");

  reader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    text => {
      const id = text.replace("QR:", "");
      if (scenesMap[id]) {
        afficherScene(id);
        reader.stop();
        document.getElementById("qr-reader").innerHTML = "";
      } else {
        alert("QR inconnu");
      }
    }
  ).catch(() => alert("Caméra indisponible"));
};
