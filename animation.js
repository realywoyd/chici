function createCoinEffect(x, y) {
    const coin = document.createElement('div');
    coin.className = 'coin-effect';
    coin.textContent = '+1';
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    document.body.appendChild(coin);

    setTimeout(() => coin.remove(), 1000);
}

function startFallingCoins() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = -50;
        createCoinEffect(x, y);
    }, 500);
}
