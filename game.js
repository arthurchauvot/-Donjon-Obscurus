let story = {};
let currentId = localStorage.getItem("currentId") || "start";

fetch("story.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(scene => {
      story[scene.id] = scene;
    });
    afficherScene(currentId);
  });

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
