const dimension = 150;
const imgStart = Math.round(Math.random() * 1000);
const randomImages = [];

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 8; i++) {
        randomImages.push(`https://picsum.photos/${dimension}/${dimension}?random=${imgStart + i}`)
    }

    let cards = [...randomImages, ...randomImages];
    shuffle(cards);
});

function shuffle(arr) {
    let i = arr.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}
