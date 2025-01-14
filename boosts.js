const boosts = {
    tapMultiplier: { level: 1, cost: 100 },
    maxEnergy: { level: 1, cost: 200 },
    energyRecovery: { level: 1, cost: 300 },
};

function buyBoost(boostType) {
    const boost = boosts[boostType];
    if (coins >= boost.cost) {
        coins -= boost.cost;
        if (boostType === 'tapMultiplier') {
            clickMultiplier = boost.level + 1;
            boost.level++;
            boost.cost *= 2;
        } else if (boostType === 'maxEnergy') {
            maxEnergy += 50;
            boost.level++;
            boost.cost *= 2;
        } else if (boostType === 'energyRecovery') {
            energyRecoveryRate = Math.max(1000, energyRecoveryRate - 1000);
            boost.level++;
            boost.cost *= 2;
        }
        updateUI();
    } else {
        alert('Недостаточно монет!');
    }
}

function updateBoostsModal() {
    const boostsList = document.getElementById('boosts-list');
    boostsList.innerHTML = '';

    for (const [boostType, boost] of Object.entries(boosts)) {
        const boostItem = document.createElement('div');
        boostItem.className = 'boost-item';

        let boostText;
        if (boostType === 'tapMultiplier') {
            boostText = `Увеличение тапов x${boost.level + 1}`;
        } else if (boostType === 'maxEnergy') {
            boostText = `Увеличение энергии +50 (Уровень ${boost.level})`;
        } else if (boostType === 'energyRecovery') {
            boostText = `Скорость восстановления энергии: 1 ед. в ${energyRecoveryRate / 1000} сек (Уровень ${boost.level})`;
        }

        boostItem.innerHTML = `
            <span>${boostText}</span>
            <button onclick="buyBoost('${boostType}')" ${coins < boost.cost ? 'disabled' : ''}>
                Купить за ${boost.cost} монет
            </button>
        `;
        boostsList.appendChild(boostItem);
    }
}
