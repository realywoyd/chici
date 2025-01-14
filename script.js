// Переменные игры
let coins = 0;
let level = 1;
let energy = 100;
let maxEnergy = 100;
let clickMultiplier = 1;
let energyRecoveryRate = 5000; // Время восстановления энергии в миллисекундах
let autoClickerActive = false;
let autoClickerInterval;
let isFreeTapBoostActive = false; // Флаг для отслеживания активности буста

// Бусты
const boosts = {
    tapMultiplier: { level: 1, cost: 100 },
    maxEnergy: { level: 1, cost: 200 },
    energyRecovery: { level: 1, cost: 300 },
    autoClicker: { cost: 100000 },
    freeTapBoost: { usesLeft: 3 } // Новый буст: 3 использования в день
};

// Сохранение прогресса
function saveGame() {
    const gameData = {
        coins,
        level,
        energy,
        maxEnergy,
        clickMultiplier,
        energyRecoveryRate,
        autoClickerActive,
        boosts
    };
    localStorage.setItem('shibaGameData', JSON.stringify(gameData));
}

// Загрузка прогресса
function loadGame() {
    const savedData = localStorage.getItem('shibaGameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        coins = gameData.coins;
        level = gameData.level;
        energy = gameData.energy;
        maxEnergy = gameData.maxEnergy;
        clickMultiplier = gameData.clickMultiplier;
        energyRecoveryRate = gameData.energyRecoveryRate;
        autoClickerActive = gameData.autoClickerActive;
        boosts.tapMultiplier = gameData.boosts.tapMultiplier;
        boosts.maxEnergy = gameData.boosts.maxEnergy;
        boosts.energyRecovery = gameData.boosts.energyRecovery;
        boosts.autoClicker = gameData.boosts.autoClicker;
        boosts.freeTapBoost = gameData.boosts.freeTapBoost || { usesLeft: 3 }; // Загружаем или инициализируем новый буст

        if (autoClickerActive) {
            activateAutoClicker();
        }
    }
    updateUI();
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('coins-panel').textContent = coins;
    document.getElementById('energy-panel').textContent = energy;
    document.getElementById('max-energy-panel').textContent = maxEnergy;
    document.getElementById('level-panel').textContent = level;
    updateBoostsModal(); // Обновляем модальное окно бустов
}

// Добавление монет
function addCoins() {
    if (isFreeTapBoostActive || energy > 0) { // Если буст активен или есть энергия
        coins += 1 * clickMultiplier;
        if (!isFreeTapBoostActive) { // Если буст не активен, тратим энергию
            energy--;
        }
        updateUI();
        saveGame();
    } else {
        alert("Недостаточно энергии!");
    }
}

// Обработка мультитача
function handleMultiTouch(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение (например, масштабирование)
    const touches = event.touches; // Получаем все касания

    // Обрабатываем каждое касание
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        animateShiba(touch); // Анимируем Шибу для каждого касания
    }
}

// Анимация Шибы
function animateShiba(event) {
    const shiba = document.querySelector('.shiba');

    // Анимация удара
    shiba.classList.add('hit');
    setTimeout(() => shiba.classList.remove('hit'), 200);

    // Анимация добычи монет
    const coinEffect = document.createElement('div');
    coinEffect.className = 'coin-effect';
    coinEffect.textContent = `+${1 * clickMultiplier}`;
    coinEffect.style.left = `${event.clientX || event.touches[0].clientX}px`; // Поддержка и мыши, и тач-событий
    coinEffect.style.top = `${event.clientY || event.touches[0].clientY}px`;
    document.body.appendChild(coinEffect);
    setTimeout(() => coinEffect.remove(), 1000);

    addCoins(); // Добавляем монеты
}

// Восстановление энергии
function recoverEnergy() {
    if (energy < maxEnergy) {
        energy++;
        updateUI();
        saveGame();
    }
}

setInterval(recoverEnergy, energyRecoveryRate);

// Автокликер
function activateAutoClicker() {
    if (autoClickerActive) return;
    autoClickerActive = true;
    autoClickerInterval = setInterval(() => {
        if (energy > 0) {
            addCoins();
        }
    }, 1000);
    saveGame();
}

// Покупка бустов
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
        } else if (boostType === 'autoClicker') {
            activateAutoClicker();
        }
        updateUI();
        updateBoostsModal();
        saveGame();
    } else {
        alert("Недостаточно монет!");
    }
}

// Активация бесплатного буста на тапы
function activateFreeTapBoost() {
    if (boosts.freeTapBoost.usesLeft > 0) {
        const randomMultiplier = Math.floor(Math.random() * 49) + 2; // Случайный множитель от 2 до 50
        clickMultiplier *= randomMultiplier;
        boosts.freeTapBoost.usesLeft--;
        isFreeTapBoostActive = true; // Активируем буст

        // Закрываем модальное окно с бустами
        closeModal('boosts-modal');

        // Показываем уведомление
        showBoostNotification();

        // Запуск анимации падающих монет
        startFallingCoins();

        // Сброс буста через 10 секунд
        setTimeout(() => {
            clickMultiplier /= randomMultiplier;
            isFreeTapBoostActive = false; // Деактивируем буст
            stopFallingCoins(); // Остановка создания монет
            updateUI();
        }, 10000);

        updateUI();
        updateBoostsModal();
        saveGame();
    } else {
        alert("Вы использовали все бесплатные бусты на сегодня!");
    }
}

// Показ уведомления о бусте
function showBoostNotification() {
    const notification = document.createElement('div');
    notification.className = 'boost-notification';
    notification.textContent = 'Буст активирован! Тапы усилены!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Уведомление исчезнет через 3 секунды
}

// Запуск анимации падающих монет
function startFallingCoins() {
    const coinInterval = setInterval(() => {
        createCoin();
    }, 200); // Создаем новую монету каждые 200 мс

    // Останавливаем создание монет через 10 секунд
    setTimeout(() => {
        clearInterval(coinInterval);
    }, 10000);
}

// Создание одной монеты
function createCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = '💰'; // Эмодзи монеты
    coin.style.left = `${Math.random() * 100}vw`; // Случайная позиция по горизонтали
    coin.style.animationDuration = `${Math.random() * 2 + 3}s`; // Случайная скорость падения
    document.body.appendChild(coin);

    // Удаление монеты после завершения анимации
    coin.addEventListener('animationend', () => {
        coin.remove();
    });
}

// Остановка создания монет (если нужно)
function stopFallingCoins() {
    // В данном случае интервал уже очищен в startFallingCoins, но можно добавить дополнительные действия, если нужно
}

// Обновление модального окна бустов
function updateBoostsModal() {
    const boostsList = document.getElementById('boosts-list');
    boostsList.innerHTML = '';

    // Обновляем количество использований бесплатного буста
    const freeBoostUses = document.querySelector('.free-boosts-panel .boost-uses');
    freeBoostUses.textContent = `${boosts.freeTapBoost.usesLeft}/3`;

    for (const [boostType, boost] of Object.entries(boosts)) {
        if (boostType === 'freeTapBoost') continue; // Пропускаем бесплатный буст

        const boostItem = document.createElement('div');
        boostItem.className = 'boost-item';

        let boostText;
        if (boostType === 'tapMultiplier') {
            boostText = `Увеличение тапов x${boost.level + 1}`;
        } else if (boostType === 'maxEnergy') {
            boostText = `Увеличение энергии +50 (Уровень ${boost.level})`;
        } else if (boostType === 'energyRecovery') {
            boostText = `Скорость восстановления энергии: 1 ед. в ${energyRecoveryRate / 1000} сек (Уровень ${boost.level})`;
        } else if (boostType === 'autoClicker') {
            boostText = `Робот`;
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

// Показ модального окна бустов
function showBoostsModal() {
    updateBoostsModal();
    const modal = document.getElementById('boosts-modal');
    modal.style.display = 'flex';
}

// Показ модального окна настроек
function showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
}

// Показ модального окна колеса удачи
function showWheel() {
    const modal = document.getElementById('wheel-modal');
    modal.style.display = 'flex';
}

// Показ модального окна Airdrop
function showAirdropModal() {
    const modal = document.getElementById('airdrop-modal');
    modal.style.display = 'flex';
}

// Функция для подключения кошелька через Telegram Wallet
function connectWallet() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const tg = Telegram.WebApp;

        // Проверка поддержки кошелька
        if (!tg.openWallet) {
            alert('Ваша версия Telegram не поддерживает подключение кошелька.');
            return;
        }

        // Открываем интерфейс кошелька
        tg.openWallet({
            amount: 0, // Сумма 0 для подключения кошелька
            currency: 'TON', // Валюта
            description: 'Подключение кошелька', // Описание
        }, (status) => {
            if (status === 'paid') {
                // Кошелёк успешно подключён
                alert('Кошелёк успешно подключён!');
                // Получаем адрес кошелька (если доступно)
                const walletAddress = tg.initDataUnsafe.user?.wallet_address;
                if (walletAddress) {
                    localStorage.setItem('walletAddress', walletAddress);
                    console.log('Адрес кошелька:', walletAddress);

                    // Отображаем адрес кошелька
                    const walletAddressDisplay = document.getElementById('wallet-address-display');
                    if (walletAddressDisplay) {
                        walletAddressDisplay.textContent = walletAddress;
                    }
                }
            } else {
                alert('Подключение кошелька отменено или не удалось.');
            }
        });
    } else {
        alert('Эта функция доступна только в Telegram Mini Apps.');
    }
}

// Закрытие модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Переключение языка
let currentLanguage = 'ru'; // По умолчанию язык - русский

function toggleLanguage() {
    const toggle = document.getElementById('language-toggle');
    currentLanguage = toggle.checked ? 'en' : 'ru'; // Определяем текущий язык
    updateLanguage(); // Обновляем текст на странице
}

function updateLanguage() {
    const elementsToTranslate = {
        'coins-panel': { ru: 'Монеты', en: 'Coins' },
        'energy-panel': { ru: 'Энергия', en: 'Energy' },
        'level-panel': { ru: 'Уровень', en: 'Level' },
        'clan-text': { ru: 'Клан', en: 'Clan' },
        'rating-text': { ru: 'Рейтинг', en: 'Rating' },
        'wheel-text': { ru: 'Колесо Удачи', en: 'Wheel of Fortune' },
        'boost-text': { ru: 'Бусты', en: 'Boosts' },
        'shop-text': { ru: 'Магазин', en: 'Shop' },
        'friends-text': { ru: 'Друзья', en: 'Friends' },
        'airdrop-text': { ru: 'Airdrop', en: 'Airdrop' },
        'roi-text': { ru: 'Рои', en: 'Swarms' },
        'settings-title': { ru: 'Настройки', en: 'Settings' },
        'label-ru': { ru: 'RU', en: 'RU' },
        'label-en': { ru: 'ENG', en: 'ENG' }
    };

    for (const [selector, translations] of Object.entries(elementsToTranslate)) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = translations[currentLanguage];
        }
    }
}

// Колесо удачи
const wheel = document.getElementById('wheel');
let isSpinning = false;

const rewards = [
    { icon: "fas fa-coins", text: "50 монет", action: () => coins += 50 },
    { icon: "fas fa-bolt", text: "20 энергии", action: () => energy += 20 },
    { icon: "fas fa-rocket", text: "x2 доход", action: () => clickMultiplier *= 2 },
    { icon: "fas fa-wine-bottle", text: "Энергетик", action: () => energyDrinks++ },
    { icon: "fas fa-network-wired", text: "Рой", action: () => swarms++ },
    { icon: "fas fa-crown", text: "Легендарный Шиба", action: () => alert("Вы получили Легендарного Шиба!") },
    { icon: "fas fa-gem", text: "1000 монет", action: () => coins += 1000 },
    { icon: "fas fa-battery-full", text: "Супер-энергия", action: () => maxEnergy += 50 },
    { icon: "fas fa-star", text: "Звезда удачи", action: () => alert("Звезда удачи активирована!") },
    { icon: "fas fa-gift", text: "Сюрприз", action: () => coins += Math.floor(Math.random() * 500) }
];

const sectionAngles = [18, 54, 90, 126, 162, 198, 234, 270, 306, 342];

function spinWheel() {
    if (isSpinning) return;

    const button = document.querySelector('.spin-button');
    button.disabled = true;
    isSpinning = true;

    const randomRotation = 360 * 5 + Math.floor(Math.random() * 360);
    wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheel.style.transform = `rotate(${randomRotation}deg)`;

    setTimeout(() => {
        const degrees = randomRotation % 360;
        const pointerAngle = (360 - degrees) % 360;

        let closestAngle = sectionAngles[0];
        let minDifference = Math.abs(pointerAngle - closestAngle);

        for (let i = 1; i < sectionAngles.length; i++) {
            const difference = Math.abs(pointerAngle - sectionAngles[i]);
            if (difference < minDifference) {
                minDifference = difference;
                closestAngle = sectionAngles[i];
            }
        }

        const rewardIndex = sectionAngles.indexOf(closestAngle);
        const reward = rewards[rewardIndex];

        reward.action();
        alert(`Вы получили: ${reward.text}`);
        updateUI();
        saveGame();

        button.disabled = false;
        isSpinning = false;
    }, 5000);
}

// Инициализация игры
window.onload = function() {
    // Симуляция загрузки
    const progressBar = document.getElementById('progress-bar-inner');
    const loadingContainer = document.querySelector('.loading-container');
    const gameContainer = document.querySelector('.game-container');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(loadingInterval);
            // Скрываем экран загрузки и показываем игру
            loadingContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame(); // Инициализация игры после загрузки
        }
    }, 300);

    function initializeGame() {
        loadGame();
        updateUI();
        updateLanguage(); // Устанавливаем язык по умолчанию

        // Проверяем, запущена ли игра через Telegram Mini Apps
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            const tg = Telegram.WebApp;
            tg.ready(); // Готовим Mini App к работе
            tg.expand(); // Разворачиваем приложение на весь экран
        } else {
            // Скрываем кнопку подключения кошелька
            const connectWalletButton = document.querySelector('.connect-wallet-button');
            if (connectWalletButton) {
                connectWalletButton.style.display = 'none';
            }

            // Выводим сообщение или скрываем другие элементы
            const airdropContent = document.querySelector('.airdrop-content');
            if (airdropContent) {
                airdropContent.innerHTML = '<p>Эта функция доступна только в Telegram Mini Apps.</p>';
            }
        }
    }
};

// Функция для обработки доната через Telegram Mini Apps
function requestPayment(amount, description) {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const tg = Telegram.WebApp;

        // Данные для оплаты
        const paymentData = {
            amount: amount, // Сумма в наноТОН (1 TON = 1_000_000_000 наноТОН)
            currency: 'TON', // Валюта
            description: description, // Описание платежа
        };

        // Отправка запроса на оплату
        tg.sendData(JSON.stringify(paymentData));

        // Обработка ответа от кошелька
        tg.onEvent('invoiceClosed', (eventData) => {
            if (eventData.status === 'paid') {
                alert('Оплата прошла успешно!');
                // Добавьте логику для начисления доната в игре
                handleDonationSuccess();
            } else {
                alert('Оплата отменена или не удалась.');
            }
        });
    } else {
        alert('Эта функция доступна только в Telegram Mini Apps.');
    }
}

// Обработка успешного доната
function handleDonationSuccess() {
    coins += 1000; // Начисляем 1000 монет
    updateUI(); // Обновляем интерфейс
    alert('Спасибо за поддержку! Вы получили 1000 монет.');
}

// Показ модального окна для доната
function showDonateModal() {
    const modal = document.getElementById('donate-modal');
    modal.style.display = 'flex';

    // Отображаем ваш адрес кошелька в модальном окне
    const walletAddressDisplay = document.getElementById('wallet-address-display');
    walletAddressDisplay.textContent = localStorage.getItem('walletAddress') || 'Не подключён';
}

// Покупка спина за 1$
async function buySpin() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const tg = Telegram.WebApp;

        // Получаем текущий курс TON/USD
        const tonPrice = await getTonPrice();
        if (!tonPrice) {
            alert('Не удалось получить курс TON. Попробуйте позже.');
            return;
        }

        // Рассчитываем сумму в наноТОН для 1$
        const amountInNanoTon = calculateNanoTonForDollar(tonPrice);

        const description = "Покупка спина на Колесе Удачи";

        // Создаем инвойс
        const invoice = {
            currency: 'TON',
            amount: amountInNanoTon.toString(), // Сумма в наноТОН
            description: description,
        };

        // Открываем инвойс
        tg.openInvoice(invoice, (status) => {
            if (status === 'paid') {
                alert('Оплата прошла успешно! Вы получили дополнительный спин.');
                addSpin(); // Добавляем спин
            } else {
                alert('Оплата отменена или не удалась.');
            }
        });
    } else {
        alert('Эта функция доступна только в Telegram Mini Apps.');
    }
}

// Функция для получения текущего курса TON/USD через CoinGecko
async function getTonPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
        const data = await response.json();
        return data['the-open-network'].usd;
    } catch (error) {
        console.error('Ошибка при получении курса TON:', error);
        return null;
    }
}

// Функция для расчета суммы в наноТОН для 1$
function calculateNanoTonForDollar(tonPrice) {
    const dollars = 1; // Сумма в долларах
    const tonAmount = dollars / tonPrice; // Сумма в TON
    const nanoTonAmount = tonAmount * 1_000_000_000; // Сумма в наноТОН
    return Math.round(nanoTonAmount); // Округляем до целого числа
}

// Добавление спина
function addSpin() {
    const spinButton = document.querySelector('.spin-button');
    spinButton.disabled = false; // Разблокируем кнопку спина
    alert('Вы получили дополнительный спин!');
}
