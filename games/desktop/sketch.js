let logos = [];
const FICHIER_COUNT = 50;
const LOGO_SIZE = 100;
let selectedLogo = null;
let dossierImg;
let zipImg;
let corbeilleImg;
let navBarImg;
let txtImg;
let pdfImg;
let imgImg;
let musiqueImg;
let dossier;
let zip;
let corbeille;
let dossierLoisirs;
let score = 0;
let filesData;
let backgroundImg;

function resizeImageKeepAspect(img, maxSize) {
  let ratio = img.width / img.height;
  if (ratio > 1) {
    // Image plus large que haute
    img.resize(maxSize, maxSize / ratio);
  } else {
    // Image plus haute que large
    img.resize(maxSize * ratio, maxSize);
  }
}

function preload() {
  // Charger les données JSON
  filesData = loadJSON("data.json");

  // Charger l'image de fond
  backgroundImg = loadImage("assets/bg.png");

  // Charger la barre de navigation
  navBarImg = loadImage("assets/nav_bar.png");

  // Charger les images des dossiers
  dossierImg = loadImage("assets/dossier.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
  zipImg = loadImage("assets/zip.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
  corbeilleImg = loadImage("assets/corbeille.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });

  // Charger les images des types de fichiers
  txtImg = loadImage("assets/txt.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
  pdfImg = loadImage("assets/pdf.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
  imgImg = loadImage("assets/img.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
  musiqueImg = loadImage("assets/musique.png", (img) => {
    resizeImageKeepAspect(img, LOGO_SIZE);
  });
}

function setup() {
  new Canvas(1920, 1080);
  displayMode("centered");

  // Créer les fichiers avec leurs noms
  let fileNames = [];
  for (let item of Object.values(filesData)) {
    fileNames.push({
      name: item.contenu,
      category: item.conteneur,
      icone: item.icone,
    });
  }

  for (let i = 0; i < FICHIER_COUNT && i < fileNames.length; i++) {
    logos[i] = new Sprite();
    // Choisir l'image selon le type d'icône
    switch (fileNames[i].icone) {
      case "txt":
        logos[i].img = txtImg;
        break;
      case "pdf":
        logos[i].img = pdfImg;
        break;
      case "img":
        logos[i].img = imgImg;
        break;
      case "musique":
        logos[i].img = musiqueImg;
        break;
    }
    logos[i].scale = 2;
    logos[i].collider = "static";
    logos[i].draggable = false;
    logos[i].type = "fichier";
    logos[i].fileName = fileNames[i].name;
    logos[i].category = fileNames[i].category;
  }

  // Créer le dossier
  dossier = new Sprite();
  dossier.img = dossierImg;
  dossier.scale = 2;
  dossier.collider = "static";
  dossier.draggable = false;
  dossier.type = "dossier";
  logos.push(dossier);

  // Créer le dossier zip
  zip = new Sprite();
  zip.img = zipImg;
  zip.scale = 2;
  zip.collider = "static";
  zip.draggable = false;
  zip.type = "zip";
  logos.push(zip);

  // Créer la corbeille
  corbeille = new Sprite();
  corbeille.img = corbeilleImg;
  corbeille.scale = 2;
  corbeille.collider = "static";
  corbeille.draggable = false;
  corbeille.type = "corbeille";
  logos.push(corbeille);

  // Créer le dossier Loisirs
  dossierLoisirs = new Sprite();
  dossierLoisirs.img = dossierImg;
  dossierLoisirs.scale = 2;
  dossierLoisirs.collider = "static";
  dossierLoisirs.draggable = false;
  dossierLoisirs.type = "dossierLoisirs";
  logos.push(dossierLoisirs);

  // Positionner les logos sans superposition
  logos.forEach((logo, index) => {
    let attempts = 0;
    let validPosition = false;

    while (!validPosition && attempts < 100) {
      logo.x = random(LOGO_SIZE / 2, width - LOGO_SIZE / 2);
      logo.y = random(LOGO_SIZE / 2, height - LOGO_SIZE / 2 - 110);

      validPosition = true;
      for (let i = 0; i < index; i++) {
        let distance = dist(logo.x, logo.y, logos[i].x, logos[i].y);
        if (distance < 100) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }
  });
}

function draw() {
  // Afficher l'image de fond en arrière-plan
  background(backgroundImg);

  // Afficher le score avec contour noir et texte blanc en gras
  textSize(32);
  textStyle(BOLD);
  strokeWeight(4);
  stroke(0);
  fill(255);
  text(`Score : ${score}`, 20, 40);

  // Réinitialiser les styles pour le reste du texte
  noStroke();
  textStyle(NORMAL);

  // Vérifier si tous les fichiers ont été rangés
  let remainingFiles = logos.filter(logo => logo.type === "fichier").length;
  if (remainingFiles === 0) {
    // Créer le lien vers Picture Tiles s'il n'existe pas déjà
    if (!document.getElementById('next-game-link')) {
      const nextGameLink = document.createElement('a');
      nextGameLink.id = 'next-game-link';
      nextGameLink.href = '../picture_tiles/index.html';
      nextGameLink.innerHTML = 'Go to Picture Tiles';
      nextGameLink.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px 40px;
          background-color: #4954CE;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          z-index: 1000;
        `;
      document.body.appendChild(nextGameLink);
    }
  }

  // Afficher les noms sous chaque élément
  textSize(16);
  textAlign(CENTER);
  logos.forEach((logo) => {
    if (logo.type === "fichier") {
      fill(0); // Texte en noir
      text(logo.fileName, logo.x, logo.y + LOGO_SIZE / 1.5);
    } else {
      // Afficher les labels sous les dossiers spéciaux
      let label = "";
      switch (logo.type) {
        case "dossier":
          label = "Work";
          break;
        case "zip":
          label = "Pictures";
          break;
        case "dossierLoisirs":
          label = "Hobbies";
          break;
        case "corbeille":
          label = "Bin";
          break;
      }
      fill(0); // Texte en noir
      text(label, logo.x, logo.y + LOGO_SIZE / 1.5);
    }
  });
  textAlign(LEFT);

  // Afficher la barre de navigation en bas, collée au bord
  image(navBarImg, 0, height - 90, width, 90);

  // Gestion du déplacement au maintien du clic
  if (mouse.pressing()) {
    if (!selectedLogo) {
      for (let logo of logos) {
        if (logo.mouse.hovering()) {
          selectedLogo = logo;
          break;
        }
      }
    }
    if (selectedLogo) {
      selectedLogo.x = mouse.x;
      selectedLogo.y = mouse.y;
    }
  } else {
    // Vérifier les collisions avec tous les conteneurs
    if (selectedLogo && selectedLogo.type === "fichier") {
      let distanceDossier = dist(
        selectedLogo.x,
        selectedLogo.y,
        dossier.x,
        dossier.y
      );
      let distanceZip = dist(selectedLogo.x, selectedLogo.y, zip.x, zip.y);
      let distanceCorbeille = dist(
        selectedLogo.x,
        selectedLogo.y,
        corbeille.x,
        corbeille.y
      );
      let distanceLoisirs = dist(
        selectedLogo.x,
        selectedLogo.y,
        dossierLoisirs.x,
        dossierLoisirs.y
      );

      if (distanceDossier < LOGO_SIZE) {
        score += selectedLogo.category === "Travail" ? 100 : -50;
        selectedLogo.remove();
        logos = logos.filter((logo) => logo !== selectedLogo);
      } else if (distanceZip < LOGO_SIZE) {
        score += selectedLogo.category === "Photos" ? 100 : -50;
        selectedLogo.remove();
        logos = logos.filter((logo) => logo !== selectedLogo);
      } else if (distanceCorbeille < LOGO_SIZE) {
        score += selectedLogo.category === "Corbeille" ? 100 : -50;
        selectedLogo.remove();
        logos = logos.filter((logo) => logo !== selectedLogo);
      } else if (distanceLoisirs < LOGO_SIZE) {
        score += selectedLogo.category === "Loisirs" ? 100 : -50;
        selectedLogo.remove();
        logos = logos.filter((logo) => logo !== selectedLogo);
      }
    }
    selectedLogo = null;
  }
}
