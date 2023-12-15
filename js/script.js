const cardHeight = 243;
const cardWidth = 168;

const deck = [
	{
		name: 'Shirt',
		value: 0,
		left: -335,
		top: -973
	},
	{
		name: '6',
		value: 6,
		left: -837,
		top: 0
	},
	{
		name: '7',
		value: 7,
		left: -1005,
		top: 0
	},
	{
		name: '8',
		value: 8,
		left: -1173,
		top: 0
	},
	{
		name: '9',
		value: 9,
		left: -1340,
		top: 0
	},
	{
		name: '10',
		value: 10,
		left: -1507,
		top: 0
	},
	{
		name: 'Jack',
		value: 2,
		left: -1675,
		top: 0
	},
	{
		name: 'Queen',
		value: 3,
		left: -1842,
		top: 0
	},
	{
		name: 'King',
		value: 4,
		left: -2010,
		top: 0
	},
	{
		name: 'Ace',
		value: 11,
		left: -2178,
		top: 0
	},
]

function Player(name, currentCard, score) {
	this.name = name;
	this.currentCard = currentCard;
	this.score = score;
}

const user = new Player('user', deck[0], 0);
const computer = new Player('computer', deck[0], 0);

let isGeneratorEnabled = true;
let currentStage = 0;

document.addEventListener("DOMContentLoaded", () => {
	const namePattern = /^[a-zA-Zа-яА-ЯёЁіІїЇґҐ'’]{2,30}$/;
	do {
		user.name = prompt("Введіть своє ім'я");
		if (!namePattern.test(user.name)) {
			alert("Введено некоректне ім'я. Ім'я повинно складатися лише з букв і має бути від 2 до 30 символів.");
		} else if (user.name[0] !== user.name[0].toUpperCase() || user.name.slice(1) !== user.name.slice(1).toLowerCase()) {
			alert("Ім'я повинно починатися з великої букви, а всі інші букви повинні бути маленькими.");
		}
	} while (!namePattern.test(user.name) || user.name[0] !== user.name[0].toUpperCase() || user.name.slice(1) !== user.name.slice(1).toLowerCase());

	document.getElementById('user-name').innerText = user.name;

	document.getElementById("button").addEventListener("click", () => {
		if (isGeneratorEnabled) {
			updateStage();
			if (currentStage == 1)
				resetScore();
			generateCards();
		}
	});

	document.addEventListener("cardsGenerated", () => {
		updateScore();
		turnOnGeneratorBtn();

		if (currentStage == 3) {
			let statusText = "";

			if (user.score == computer.score) {
				statusText = "Упс, нічия!";
			} else {
				let winner = user.score > computer.score ? user : computer;
				statusText = `Переміг ${winner.name}`;
			}
			document.getElementById("game-status").innerText = statusText;
		}
	});

	async function generateCards() {
		disableGeneratorBtn();
		for (let i = 1; i < 10; i++) {
			await new Promise(resolve => setTimeout(resolve, 10 * i));
			user.currentCard = generateRandomCard();
			computer.currentCard = generateRandomCard();
			displayCard('user-current-card', user.currentCard);
			displayCard('computer-current-card', computer.currentCard);
			if (i == 9) {
				document.dispatchEvent(new Event("cardsGenerated"));
			}
		}
	}

	function displayCard(elementId, card) {
		document.getElementById(elementId).style.backgroundPosition = getBackgroundPosition(card);
	}

	function displayBonus(value) {
		const bonusElement = document.querySelector('.bonus');
		bonusElement.innerText = `+${value}`;
		bonusElement.style.opacity = '1';
		setTimeout(() => { bonusElement.style.opacity = '0'; }, 1000);
	}

	function updateStage() {
		currentStage++;

		if (currentStage > 3) {
			currentStage = 1;
		}
		document.getElementById("game-status").innerText =
			currentStage >= 1 && currentStage <= 3 ? `Cпроба ${currentStage}/3` : "Start";

	}

	function updateScore() {
		user.score += user.currentCard.value;
		computer.score += computer.currentCard.value;
		document.getElementById("user-score").innerText = `${user.score}`;
		document.getElementById("computer-score").innerText = `${computer.score}`;
	}

	function updateScoreElement(id, score) {
		document.getElementById(id).innerText = score;
	}
	
	function resetScore() {
		user.score = 0;
		computer.score = 0;
		updateScoreElement("user-score", user.score);
		updateScoreElement("computer-score", computer.score);
	}
	

	function disableGeneratorBtn() {
		isGeneratorEnabled = false;
		document.getElementById("button").style.backgroundColor = "gray";
	}

	function turnOnGeneratorBtn() {
		isGeneratorEnabled = true;
		document.getElementById("button").style.backgroundColor = "lightgray";
	}
});

function getBackgroundPosition(card) {
	return `${card.left}px ${card.top}px`;
}

function getBackgroundPositionByOffset(left = 0, right = 0) {
	return `${left}px ${right}px`;
}


function generateRandomCard() {
	let randomCardIndex = Math.floor(Math.random() * 9);
	let randomSuitNumber = Math.floor(Math.random() * 4);

	let suitTopOffset = 0 - (randomSuitNumber * cardHeight);

	const { name, value, left } = deck[randomCardIndex];

	const genCard = {
		name,
		value,
		left,
		top: suitTopOffset,
	};

	return genCard;
}
