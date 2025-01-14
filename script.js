// Основные переменные игры
let coins = 0;
let energy = 100;
let maxEnergy = 100;
let level = 1;
let clickMultiplier = 1;
let energyRecoveryRate = 5000; // Время восстановления энергии в миллисекундах

// Функция для тапа по Шибе
function tapShiba() {
    if (energy > 0) {
        coins += 1 * clickMultiplier;
        energy -= 1;
        updateUI();
        createCoinEffect(event.clientX, event.clientY);
    } else {
        alert('Недостаточно энергии!');
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('coins-panel').textContent = coins;
    document.getElementById('energy-panel').textContent = energy;
    document.getElementById('max-energy-panel').textContent = maxEnergy;
    document.getElementById('level-panel').textContent = level;
}

// Функции для модальных окон
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Инициализация игры
window.onload = function() {
    const progressBar = document.getElementById('progress-bar-inner');
    const loadingContainer = document.querySelector('.loading-container');
    const gameContainer = document.querySelector('.game-container');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingContainer.style.display = 'none';
            gameContainer.style.display = 'block';
        }
    }, 300);
};
