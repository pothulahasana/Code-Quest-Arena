const correctPreorder = [50, 30, 20, 40, 70, 60, 80];
const dropRow = document.getElementById('drop-row');
const coinsDisplay = document.getElementById('coins');
const tree = document.getElementById('tree');
const submitBtn = document.getElementById('submit-btn');
let coins = window.authManager?.getStoredCoins() ?? (JSON.parse(localStorage.getItem('user') || '{}').coins ?? 0);
coinsDisplay.textContent = coins;

async function syncCoinsToBackend(coinsValue) {
  if (window.authManager && typeof window.authManager.updateCoinsOnBackend === 'function') {
    await window.authManager.updateCoinsOnBackend(coinsValue);
    coins = window.authManager.getStoredCoins();
    coinsDisplay.textContent = coins;
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
        coinsDisplay.textContent = coins;
      }
    }
  } catch (error) {
    console.error('Coin sync failed:', error);
  }
}

function createDropZones() {
  dropRow.innerHTML = '';
  for (let i = 0; i < correctPreorder.length; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop-zone';
    drop.dataset.index = i;

    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('drop', e => {
      e.preventDefault();
      const val = e.dataTransfer.getData('text/plain');
      if (drop.textContent.trim() === '') {
        drop.textContent = val;
        drop.classList.add('filled');
        const draggedNode = [...tree.querySelectorAll('.tree-node')].find(n => n.dataset.value === val);
        if (draggedNode) draggedNode.style.visibility = 'hidden';
      }
    });

    drop.addEventListener('dblclick', () => {
      if (drop.textContent.trim()) {
        const removedValue = drop.textContent.trim();
        drop.textContent = '';
        drop.classList.remove('filled');
        const draggedNode = [...tree.querySelectorAll('.tree-node')].find(n => n.dataset.value === removedValue);
        if (draggedNode) draggedNode.style.visibility = 'visible';
      }
    });

    dropRow.appendChild(drop);
  }
}

function makeNodesDraggable() {
  document.querySelectorAll('.tree-node').forEach(node => {
    node.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', node.dataset.value);
    });
  });
}

submitBtn.addEventListener('click', async () => {
  if (coins < 10) {
    alert('🚫 You need at least 10 coins to play.');
    return;
  }

  const entered = [...dropRow.children].map(d => d.textContent.trim());
  const correct = correctPreorder.map(String);

  if (JSON.stringify(entered) === JSON.stringify(correct)) {
    coins -= 5;
    await syncCoinsToBackend(coins);
    alert('✅ Correct! You won. 5 coins deducted as game cost.');
    localStorage.setItem('rewardCoins', '5');
    setTimeout(() => {
      window.location.href = '../html/funzone.html';
    }, 2500);
  } else {
    coins -= 10;
    await syncCoinsToBackend(coins);
    alert('❌ Incorrect! You lost. 10 coins deducted.');
    setTimeout(() => {
      window.location.href = '../html/funzone.html';
    }, 2500);
  }

  coinsDisplay.textContent = coins;

  if (coins < 10) {
    submitBtn.disabled = true;
    window.location.href = '../html/funzone.html';
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  createDropZones();
  document.querySelectorAll('.tree-node').forEach(node => {
    node.style.visibility = 'visible';
  });
  if (coins >= 10) submitBtn.disabled = false;
});

createDropZones();
makeNodesDraggable();
