let ball;
let score;
let btnAddScore;

// function preload() {
// 	// Chargement du score depuis le localStorage
// 	score = parseInt(localStorage.getItem(minigameType)) || 0;

// }


function saveScore(minigameType) {
	// Sauvegarde dans le localStorage
	localStorage.setItem(minigameType, score);
}

export { saveScore };
