const shopItems = [
    { id: 'tapBoost', name: 'Буст тапов', cost: 100, description: 'Увеличивает множитель тапов.' },
    { id: 'energyBoost', name: 'Буст энергии', cost: 200, description: 'Увеличивает максимальную энергию.' },
    { id: 'recoveryBoost', name: 'Буст восстановления', cost: 300, description: 'Ускоряет восстановление энергии.' },
];

function buyShopItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (coins >= item.cost) {
        coins -= item.cost;
        applyShopItem(itemId);
        updateUI();
    } else {
        alert('Недостаточно монет!');
    }
}

function applyShopItem(itemId) {
    if (itemId === 'tapBoost') {
        clickMultiplier += 1;
    } else if (itemId === 'energyBoost') {
        maxEnergy += 50;
    } else if (itemId === 'recoveryBoost') {
        energyRecoveryRate = Math.max(1000, energyRecoveryRate - 1000);
    }
}

function updateShopModal() {
    const shopList = document.getElementById('shop-list');
    shopList.innerHTML = '';

    shopItems.forEach(item => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        shopItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button onclick="buyShopItem('${item.id}')" ${coins < item.cost ? 'disabled' : ''}>
                Купить за ${item.cost} монет
            </button>
        `;
        shopList.appendChild(shopItem);
    });
}
