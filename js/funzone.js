let coins = window.authManager?.getStoredCoins() ?? 0;
const coinDisplayElements = document.querySelectorAll("#coinDisplay");
async function syncCoinsToBackend(coinsValue) {
  if (window.authManager && typeof window.authManager.updateCoinsOnBackend === 'function') {
    await window.authManager.updateCoinsOnBackend(coinsValue);
    coins = window.authManager.getStoredCoins();
    return;
  }

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || !user?.id) return;

  try {
    const response = await fetch('http://localhost:5000/api/users/coins', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ coins: coinsValue })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        coins = data.user.coins;
      }
    }
  } catch (error) {
    console.error('Coin sync failed:', error);
  }
}
function updateCoinDisplays() {
  coinDisplayElements.forEach(el => el.textContent = coins);
  if (window.authManager && typeof window.authManager.updateCoins === 'function') {
    window.authManager.updateCoins();
  }
}
updateCoinDisplays();
async function playGame(gameUrl, cost) {
  if (coins >= cost) {
    coins -= cost;
    await syncCoinsToBackend(coins);
    updateCoinDisplays();
    alert(`✅ You spent ${cost} coins! Starting game...`);
    window.location.href = gameUrl;
  } else {
    alert("❌ Not enough coins to play this game.");
  }
}
