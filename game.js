let story = {};
let currentId = localStorage.getItem("currentId") || "start";

// Chargement de l'histoire
fetch("story.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(scene => {
      story[scene.id] = scene;
    });
    afficherScene(currentId);
  });

// Fonction pour afficher une scène
function afficherScene(id) {
  const scene = story[id];
  if (!scene) return;

  currentId = id;
  localStorage.setItem("currentId", id);

  document.getElementById("texte").innerText = scene.texte;

  const choixDiv = document.getElementById("choix");
  choixDiv.innerHTML = "";

  for (let i = 1; i <= 2; i++) {
    const label = scene["choix" + i];
    const cible = scene["cible" + i];
    if (label && cible) {
      const btn = document.createElement("button");
      btn.innerText = label;
      btn.onclick = () => afficherScene(cible);
      choixDiv.appendChild(btn);
    }
  }
}

// QR code scanner minimal
document.getElementById("scanBtn").onclick = () => {
  const qrReader = new Html5Qrcode("qr-reader");

  qrReader.start(
    { facingMode: "environment" },
    {
      fps: 10, // frames par seconde
      qrbox: 250 // zone de scan
    },
    qrCodeMessage => {
      const qrId = qrCodeMessage.replace("QR:", "");
      if (story[qrId]) {
        afficherScene(qrId);
        qrReader.stop(); // arrêter le scan après succès
        document.getElementById("qr-reader").innerHTML = "";
      } else {
        alert("QR code inconnu : " + qrId);
      }
    },
    errorMessage => {
      // peut rester vide
    }
  ).catch(err => {
    console.error("Impossible de démarrer le scan QR", err);
  });
};

