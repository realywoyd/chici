let clans = [];

function createClan(name) {
    const clan = { name, members: [localStorage.getItem('walletAddress')], score: 0 };
    clans.push(clan);
    updateClansModal();
}

function joinClan(clanName) {
    const clan = clans.find(c => c.name === clanName);
    if (clan) {
        clan.members.push(localStorage.getItem('walletAddress'));
        updateClansModal();
    }
}

function updateClansModal() {
    const clansList = document.getElementById('clans-list');
    clansList.innerHTML = '';

    clans.forEach(clan => {
        const clanItem = document.createElement('div');
        clanItem.className = 'clan-item';
        clanItem.innerHTML = `
            <h3>${clan.name}</h3>
            <p>Участники: ${clan.members.length}</p>
            <p>Очки: ${clan.score}</p>
            <button onclick="joinClan('${clan.name}')">Вступить</button>
        `;
        clansList.appendChild(clanItem);
    });
}
