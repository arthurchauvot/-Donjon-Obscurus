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
document.getElementById("scanBtn").onclick = async () => {
  // Crée un input type file pour la caméra
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // On lit le QR code avec jsQR
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // jsQR: https://github.com/cozmo/jsQR
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        const qrId = code.data.replace("QR:", "");
        if (story[qrId]) {
          afficherScene(qrId);
        } else {
          alert("QR code inconnu : " + qrId);
        }
      } else {
        alert("QR code non détecté");
      }
    };
  };
  input.click();
};
