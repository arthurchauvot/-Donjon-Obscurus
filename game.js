let journal = JSON.parse(localStorage.getItem("journal")) || [];

// Fonction pour afficher le journal
function afficherJournal() {
  const overlay = document.getElementById("journalOverlay");
  const content = document.getElementById("journalContent");
  content.innerHTML = "";
  journal.forEach((entry, index) => {
    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${entry}`;
    content.appendChild(p);
  });
  overlay.style.display = "block";
}

// Fonction pour fermer le journal
document.getElementById("closeJournal").onclick = () => {
  document.getElementById("journalOverlay").style.display = "none";
};

// Bouton journal
document.getElementById("journalBtn").onclick = afficherJournal;

// Dans la fonction afficherScene(), ajout de la sauvegarde des entrées
function afficherScene(sceneId) {
  const scene = scenesMap[sceneId];
  if (!scene) return;

  currentSceneId = sceneId;
  localStorage.setItem("currentSceneId", sceneId);

  const setup = scene.setup;
  currentChapter = setup;

  // Titre, sous-titre, texte et style (comme précédemment)
  document.title = setup.titre || "Escape Game";
  const pageTitle = document.getElementById("page-title");
  pageTitle.innerText = setup.titre || "Escape Game";
  pageTitle.style.color = setup.couleurTitre || "#000";

  const chapitreTitle = document.getElementById("chapitre-title");
  chapitreTitle.innerText = setup.sousTitre || "";
  chapitreTitle.style.color = setup.couleurSousTitre || "#666";

  const texteDiv = document.getElementById("texte");
  texteDiv.innerText = scene.texte || "";
  texteDiv.style.color = setup.couleurTexte || "#000";

  // Fond
  if (setup.imageFond) {
    document.body.style.backgroundImage = `url(${setup.imageFond})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = setup.couleurFond || "#fff";
  }

  // Choix dynamiques
  const choixDiv = document.getElementById("choix");
  choixDiv.innerHTML = "";
  scene.choix.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.label;
    if (setup.styleBouton === "rounded") btn.classList.add("rounded");
    btn.onclick = () => afficherScene(c.cible);
    choixDiv.appendChild(btn);
  });

  // Ajouter les entrées du journal si présentes
  if (scene.journal && scene.journal.length > 0) {
    scene.journal.forEach(entry => {
      if (!journal.includes(entry)) {
        journal.push(entry);
      }
    });
    localStorage.setItem("journal", JSON.stringify(journal));
  }
}
