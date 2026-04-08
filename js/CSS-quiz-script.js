let current = 0, score = 0;

function getStoredCoins() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.coins ?? 0;
}

function setStoredCoins(coins) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user?.id) return;
  user.coins = coins;
  localStorage.setItem('user', JSON.stringify(user));
  if (window.authManager && typeof window.authManager.updateCoins === 'function') {
    window.authManager.updateCoins();
  } else {
    updateCoinElements(coins);
  }
}

function updateCoinElements(coins) {
  const coinElements = document.querySelectorAll('.action_name1, #coin-count, #coinDisplay, [data-coins], .coin-counter span');
  coinElements.forEach(el => { if (el) el.textContent = coins; });
}

async function syncCoinsToBackend(coinsValue) {
  if (window.authManager && typeof window.authManager.updateCoinsOnBackend === 'function') {
    await window.authManager.updateCoinsOnBackend(coinsValue);
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
        if (window.authManager && typeof window.authManager.updateCoins === 'function') {
          window.authManager.updateCoins();
        } else {
          updateCoinElements(data.user.coins);
        }
      }
    }
  } catch (error) {
    console.error('Coin sync failed:', error);
  }
}

// NEW: Add coins earned (increment approach)
async function addCoinsEarned(coinsEarned) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://localhost:5000/api/coins/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ coinsEarned })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Coins updated:", data.coins);
      
      // Update local storage and UI
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.coins = data.coins;
      localStorage.setItem('user', JSON.stringify(user));
      updateCoinElements(data.coins);
      
      return data.coins;
    }
  } catch (error) {
    console.error('Error adding coins:', error);
  }
}

function loadQuestion() {
  const q = questions[current];
  document.getElementById("question-text").innerText = `${current + 1}. ${q.question}`;
  const form = document.getElementById("options-form");
  form.innerHTML = "";
  q.options.forEach((opt, index) => {
    const option = document.createElement("label");
    option.className = "option";
    option.innerHTML = `
      <input type="radio" name="option" value="${index}" />
      ${opt}
    `;
    form.appendChild(option);
  });
  updateProgressBar();
}

function updateProgressBar() {
  const fill = document.getElementById("progress-bar-fill");
  const percent = (current / questions.length) * 100;
  fill.style.width = `${percent}%`;
}

function submitAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Please select an option.");
    return;
  }
  if (parseInt(selected.value) === questions[current].answer) {
    score++;
  }
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    updateProgressBar();
    showResult();
  }
}

async function showResult() {
  const resultDiv = document.getElementById("result");
  document.querySelector(".submit-btn").style.display = "none";
  document.getElementById("question-text").style.display = "none";
  document.getElementById("options-form").style.display = "none";

  let starsEarned = 0;
  if (score >= 18) starsEarned = 3;
  else if (score >= 14) starsEarned = 2;
  else if (score >= 7) starsEarned = 1;

  if (starsEarned > 0) {
    let starsHtml = '<div class="stars">';
    for (let i = 1; i <= 3; i++) {
      starsHtml += `<span class="star${i <= starsEarned ? ' filled' : ''}">&#9733;</span>`;
    }
    starsHtml += '</div>';

    const coinsEarned = starsEarned * coinsPerStar;
    // NEW: Use increment approach - send only earned coins
    await addCoinsEarned(coinsEarned);

    resultDiv.innerHTML = `
        <i class="fas fa-check-circle pass-icon" style="font-size:40px;"></i>
        <h2 class="pass-heading">Great Job!</h2>
        <p class="score-text">You passed! Score: ${score}/${questions.length}</p>
        ${starsHtml}
        <p style="margin-top: 15px; font-weight: 600; color: #00f2fe;">
          Coins earned: ${coinsEarned}
        </p>
    `;

    completeLevel(levelNum, starsEarned);
  } else {
    resultDiv.innerHTML = `
        <i class="fas fa-times-circle fail-icon" style="font-size:40px;"></i>
        <h2 class="fail-heading">Try Again!</h2>
        <p class="score-text">You scored ${score}/${questions.length}.</p>
    `;
  }

  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";
  okBtn.className = "ok-btn";
  okBtn.onclick = () => window.location.href = "CSS-levels.html";
  resultDiv.appendChild(okBtn);
}

function completeLevel(levelNum, starsEarned) {
  const subject = detectSubject(); // 'dsa', 'html', 'css', 'js'
  const STORAGE_KEY = subject + '_quiz';
  
  // Keep localStorage as fallback
  const starData = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_stars`) || "{}");
  if (!starData[levelNum] || starData[levelNum] < starsEarned) {
    starData[levelNum] = starsEarned;
    localStorage.setItem(`${STORAGE_KEY}_stars`, JSON.stringify(starData));
  }
  const currentUnlocked = parseInt(localStorage.getItem(`${STORAGE_KEY}_unlocked`)) || 1;
  if (starsEarned >= 1 && levelNum + 1 > currentUnlocked) {
    localStorage.setItem(`${STORAGE_KEY}_unlocked`, levelNum + 1);
  }

  // ✅ NEW: Save to backend
  if (localStorage.getItem('token')) {
    if (window.api?.saveQuizProgress) {
      api.saveQuizProgress(subject, levelNum, starsEarned)
        .catch(err => console.log('Offline - saved locally only'));
    }
    if (window.api?.awardCoins) {
      api.awardCoins(starsEarned * 10, `Completed ${subject} quiz level ${levelNum}`)
         .then(r => { if (r.success) setStoredCoins(r.coins); });
    } else {
      const totalCoins = getStoredCoins();
      syncCoinsToBackend(totalCoins);
    }
  }
}

function detectSubject() {
  const url = window.location.pathname;
  if (url.includes('DSA')) return 'dsa';
  if (url.includes('HTML')) return 'html';
  if (url.includes('CSS')) return 'css';
  if (url.includes('js-quiz')) return 'js';
}

window.addEventListener("DOMContentLoaded", loadQuestion);
