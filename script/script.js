const dimension = 150;
const imgStart = Math.round(Math.random() * 1000);
const randomImages = [];
const cardsElement = document.querySelector('.cards');

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 8; i++) {
        randomImages.push(`https://picsum.photos/${dimension}/${dimension}?random=${imgStart + i}`)
    }
    console.log(randomImages)

    initGame();
});
let firstCard = null;
let lockBoard = false;
let moves = 0;
let matchedCards = 0;


function initGame() {
    let cards = [...randomImages, ...randomImages];

    shuffle(cards);

    cardsElement.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');
        cardElement.addEventListener('click', handleCardClick);

        cardsElement.appendChild(cardElement);
    });
}

function handleCardClick(e) {
    if(lockBoard) return;
    checkMatch(e.currentTarget);
}

function checkMatch(secondElement) {
    if (firstCard != null && firstCard.dataset.value != null) {
        if(firstCard === secondElement) {
            return;
        }
        if (secondElement.dataset.value === firstCard.dataset.value) {
            firstCard.style.border = '1px solid red';
            secondElement.style.border = '1px solid red';
            secondElement.style.backgroundImage = `url(${secondElement.dataset.value})`;
            firstCard.classList.add('matched');
            secondElement.classList.add('matched');
            secondElement.removeEventListener('click', handleCardClick);
            firstCard.removeEventListener('click', handleCardClick);
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
            }, 1000)
        }
        moves++;
    } else {
        firstCard = secondElement;
        firstCard.style.backgroundImage = `url(${firstCard.dataset.value})`;
    }
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
