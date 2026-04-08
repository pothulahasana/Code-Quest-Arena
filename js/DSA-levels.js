const levelData = [
  { name: "Arrays Mastery", image: "../images/arrays.png" },
  { name: "String Manipulation", image: "../images/strings.png" },
  { name: "Linked List Logic", image: "../images/linkedlist.png" },
  { name: "Stacks & Queues", image: "../images/stack.png" },
  { name: "Sorting Techniques", image: "../images/sorting.png" },
  { name: "Search Strategies", image: "../images/searching.png" },
  { name: "Tree Traversals", image: "../images/trees.png" },
  { name: "Graph Explorers", image: "../images/graphs.png" },
  { name: "Hashing Hacks", image: "../images/hashmap.png" },
  { name: "Recursive Thinking", image: "../images/recursion.png" },
  { name: "Dynamic Programming", image: "../images/dynamic-programming.png" },
  { name: "Greedy Algorithms", image: "../images/greedy-algo.png" }
];

const STORAGE_KEY = 'dsa_quiz';
const grid = document.getElementById("levels-grid");
const stars = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_stars`) || "{}");
const unlockedLevel = parseInt(localStorage.getItem(`${STORAGE_KEY}_unlocked`)) || 1;
const coinCountElem = document.getElementById("coin-count");
let coins = 0;

async function initializeCoinCount() {
  if (window.authManager && authManager.isLoggedIn()) {
    await authManager.refreshUserData();
    coins = authManager.getStoredCoins();
    authManager.updateCoins();
  } else {
    coins = parseInt(localStorage.getItem("coins")) || 0;
  }

  if (coinCountElem) {
    coinCountElem.textContent = coins;
  }
}

initializeCoinCount();

// Create the level cards dynamically
levelData.forEach((level, index) => {
  const levelNum = index + 1;
  const isUnlocked = levelNum <= unlockedLevel;
  const starsEarned = stars[levelNum] || 0;

  const card = document.createElement("div");
  card.className = `level-card ${isUnlocked ? "" : "locked"}`;

  if (isUnlocked) {
    card.style.cursor = "pointer";
    card.onclick = () => {
      window.location.href = `DSA-quiz-level${levelNum}.html`;
    };
  }

  const img = document.createElement("img");
  img.src = level.image;
  img.alt = level.name;
  img.className = "level-img";

  const title = document.createElement("div");
  title.className = "level-title";
  title.textContent = `Level ${levelNum}: ${level.name}`;

  const starsDiv = document.createElement("div");
  starsDiv.className = "star-container";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.className = "star";
    if (i < starsEarned) {
      star.textContent = "★";
      star.classList.add("filled");
    } else {
      star.textContent = "☆";
      star.classList.add("empty");
    }
    starsDiv.appendChild(star);
  }

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(starsDiv);

  if (!isUnlocked) {
    const lock = document.createElement("div");
    lock.className = "lock-icon";
    lock.textContent = "🔒";
    card.appendChild(lock);
  }

  grid.appendChild(card);
});


document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem("stars");
    localStorage.setItem("unlockedLevel", "1");
    localStorage.setItem("coins", "0");  
    location.reload();
  }
});


document.getElementById("back-btn").addEventListener("click", () => {
  window.history.back();
});


function completeLevel(levelNum, starsEarned) {
  
  const starData = JSON.parse(localStorage.getItem("stars") || "{}");
  if (!starData[levelNum] || starData[levelNum] < starsEarned) {
    starData[levelNum] = starsEarned;
    localStorage.setItem("stars", JSON.stringify(starData));
  }

  
  const currentUnlocked = parseInt(localStorage.getItem("unlockedLevel")) || 1;
  if (starsEarned >= 1 && levelNum + 1 > currentUnlocked) {
    localStorage.setItem("unlockedLevel", levelNum + 1);
  }

  
  if (starsEarned > 0) {
    let coins = parseInt(localStorage.getItem("coins")) || 0;
    coins += starsEarned * 10;
    localStorage.setItem("coins", coins.toString());

    
    const coinCountElem = document.getElementById("coin-count");
    if (coinCountElem) {
      coinCountElem.textContent = coins;
    }
  }

//   function awardCoins(stars) {
//   const coinsEarned = stars * 10;
//   let currentCoins = parseInt(localStorage.getItem("coin-count")) || 0;
//   currentCoins += coinsEarned;
//   localStorage.setItem("coin-count", currentCoins);
// }

  function completeLevel(levelNum, starsEarned) {
      let coins = parseInt(localStorage.getItem("coins")) || 0;
      coins += starsEarned * 10; 
      localStorage.setItem("coins", coins.toString());
  }
}
