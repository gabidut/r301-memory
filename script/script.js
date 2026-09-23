const dimension = 150;
const imgStart = Math.round(Math.random() * 1000);
const randomImages = [];
const cardsElement = document.querySelector(".cards");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const startButton = document.querySelector("#start");
const memoryTitleElement = document.querySelector("#memoryTitle");

let savedBestScore = localStorage.getItem("bestScore")
    ? JSON.parse(localStorage.getItem("bestScore"))
    : null;

let startedAt = 0;
let firstCard = null;
let lockBoard = false;
let moves = 0;
let matchedCards = 0;
let timeInterval;

for (let i = 0; i < 8; i++) {
    randomImages.push(`https://picsum.photos/${dimension}/${dimension}?random=${imgStart + i}`);
}

document.addEventListener("DOMContentLoaded", () => {
    startButton.addEventListener("click", initGame);

    "Jeu du Memory".split('').forEach((word, index) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.innerHTML = word === ' ' ? '&nbsp;' : word;
            span.classList.add('anim');
            memoryTitleElement.appendChild(span);
        }, index * 100);
    });
});

function initGame() {
    moves = 0;
    matchedCards = 0;
    firstCard = null;
    lockBoard = false;

    if (timeInterval) clearInterval(timeInterval);

    let cards = [...randomImages, ...randomImages];
    fisherYatesShuffle(cards);

    scoreElement.textContent = `0/${randomImages.length} cartes associées`;
    cardsElement.innerHTML = '';
    startButton.style.display = "none";

    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add("card");
        cardElement.dataset.value = card;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');

        cardElement.addEventListener('click', handleCardClick);
        cardElement.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(e);
            }
        });

        cardsElement.appendChild(cardElement);
    });

    startedAt = Date.now();
    timeInterval = setInterval(() => {
        const elapsedTime = Math.round((Date.now() - startedAt) / 1000);
        timeElement.textContent = `Temps écoulé : ${elapsedTime} secondes`;
    }, 1000);
}

function handleCardClick(e) {
    if (lockBoard) return;

    const currentCard = e.currentTarget;

    if (currentCard === firstCard || currentCard.classList.contains('matched')) return;

    if (firstCard && firstCard.dataset.value) {
        checkMatch(currentCard);
    } else {
        firstCard = currentCard;
        firstCard.classList.add('clicked');
        firstCard.style.backgroundImage = `url(${firstCard.dataset.value})`;
    }
}

function checkMatch(secondElement) {
    secondElement.classList.add('clicked');
    secondElement.style.backgroundImage = `url(${secondElement.dataset.value})`;
    moves++;

    if (secondElement.dataset.value === firstCard.dataset.value) {
        firstCard.classList.add('matched');
        secondElement.classList.add('matched');

        firstCard = null;
        matchedCards++;

        scoreElement.textContent = `${matchedCards}/${randomImages.length} cartes associées`;

        if (matchedCards === randomImages.length) {
            handleVictory();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            secondElement.style.backgroundImage = '';
            firstCard.style.backgroundImage = '';
            firstCard.classList.remove('clicked');
            secondElement.classList.remove('clicked');

            firstCard = null;
            lockBoard = false;
        }, 800);
    }
}

function handleVictory() {
    const timeElapsed = Math.round((Date.now() - startedAt) / 1000);
    scoreElement.textContent = `Vous avez gagné en ${moves} coups et ${timeElapsed} secondes !`;

    clearInterval(timeInterval);
    timeElement.textContent = '';
    startButton.innerHTML = 'Rejouer';
    startButton.style.display = 'block';

    if (savedBestScore === null || moves < savedBestScore.moves || timeElapsed < savedBestScore.timeElapsed) {
        addBestScore(timeElapsed);
    }
}

function addBestScore(timeElapsed) {
    const newBestScore = { moves, timeElapsed };
    localStorage.setItem("bestScore", JSON.stringify(newBestScore));
    savedBestScore = newBestScore;

    scoreElement.textContent += " (Record battu !) 🏆";

    confettis();
}

function fisherYatesShuffle(arr) {
    let i = arr.length, j;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}