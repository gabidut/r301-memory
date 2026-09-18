const dimension = 150;
const imgStart = Math.round(Math.random() * 1000);
const randomImages = [];
let cards = [...randomImages, ...randomImages];
const cardsElement = document.querySelector('.cards');

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 8; i++) {
        randomImages.push(`https://picsum.photos/${dimension}/${dimension}?random=${imgStart + i}`)
    }

    initGame();
});

function initGame() {
    shuffle(cards);
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');
        cardElement.appendChild(cardElement);
    });
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
