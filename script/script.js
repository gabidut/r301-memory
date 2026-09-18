const dimension = 150;
const imgStart = Math.round(Math.random() * 1000);
const randomImages = [];
const cardsElement = document.querySelector('.cards');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');
const startButton = document.querySelector('#start');
let startedAt = 0;
for (let i = 0; i < 8; i++) {
    randomImages.push(`https://picsum.photos/${dimension}/${dimension}?random=${imgStart + i}`)
}
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () => {
        initGame();
    });
});
let firstCard = null;
let lockBoard = false;
let moves = 0;
let matchedCards = 0;
let timeInterval;

function initGame() {
    let cards = [...randomImages, ...randomImages];

    shuffle(cards);
    scoreElement.textContent = "0/" + randomImages.length + " cartes associées";
    cardsElement.innerHTML = '';
    startButton.style.display = 'none';
    cards.forEach((card, _index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');
        cardElement.addEventListener('click', handleCardClick);

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
    checkMatch(e.currentTarget);
}

function checkMatch(secondElement) {
    if (firstCard != null && firstCard.dataset.value != null) {
        if (firstCard === secondElement) {
            return;
        }
        if (secondElement.dataset.value === firstCard.dataset.value) {
            firstCard.style.border = '1px solid red';
            secondElement.style.border = '1px solid red';
            secondElement.style.backgroundImage = `url(${secondElement.dataset.value})`;
            firstCard.classList.add('matched');
            firstCard.removeEventListener('click', handleCardClick);
            secondElement.classList.add('matched');
            secondElement.removeEventListener('click', handleCardClick);
            firstCard = null;
            matchedCards++;
        } else {
            const tempCardElement = secondElement;
            tempCardElement.style.backgroundImage = `url(${secondElement.dataset.value})`;
            lockBoard = true;
            setTimeout(() => {
                tempCardElement.style.backgroundImage = ``;
                firstCard.style.backgroundImage = '';
                firstCard = null;
                lockBoard = false;
            }, 800);
        }
        moves++;
    } else {
        firstCard = secondElement;
        firstCard.style.backgroundImage = `url(${firstCard.dataset.value})`;
    }
    scoreElement.textContent = `${matchedCards}/${randomImages.length} cartes associées`;
    if (matchedCards === randomImages.length) {
        handleVictory();
    }
}

function handleVictory() {
    scoreElement.textContent = `Vous avez gagné en ${moves} coups et ${Math.round((Date.now() - startedAt) / 1000)} secondes !`;
    clearInterval(timeInterval);
    timeElement.textContent = '';
    startButton.style.display = 'block';
}

function shuffle(arr) {
    let i = arr.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}
