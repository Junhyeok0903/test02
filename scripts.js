const startButton = document.getElementById("start-button");
const userInputs = document.querySelectorAll(".user-number");
const playerNameInput = document.getElementById("player-name");
const numbersContainer = document.getElementById("numbers-container");
const rankingDisplay = document.getElementById("ranking");
const statsContainer = document.getElementById("stats-container");

const NUMBER_RANGE = 45;
const DRAW_COUNT = 6;
let userNumbers = [];
let drawnNumbers = [];

// 플레이어별 등수 기록
let playerStats = {};

// 등수와 상금
const PRIZES = {
  1: "15억 원",
  2: "1500만 원",
  3: "500만 원",
  4: "5만 원",
  5: "5000원"
};

startButton.addEventListener("click", startDraw);

function startDraw() {
  // 초기화
  numbersContainer.innerHTML = "";
  drawnNumbers = [];
  rankingDisplay.textContent = "";

  const playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("이름을 입력해주세요!");
    return;
  }

  // 플레이어 기록 초기화
  if (!playerStats[playerName]) {
    playerStats[playerName] = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 꽝: 0
    };
  }

  // 사용자 숫자 입력
  userNumbers = Array.from(userInputs)
    .map(input => parseInt(input.value))
    .filter(num => num >= 1 && num <= 45);

  if (userNumbers.length !== 6 || new Set(userNumbers).size !== 6) {
    alert("1부터 45까지의 숫자 6개를 중복 없이 입력해주세요.");
    return;
  }

  // 숫자 하나씩 추첨
  let availableNumbers = Array.from({ length: NUMBER_RANGE }, (_, i) => i + 1);
  let drawInterval = setInterval(() => {
    if (drawnNumbers.length < DRAW_COUNT) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNumber = availableNumbers.splice(randomIndex, 1)[0];
      drawnNumbers.push(randomNumber);
      displayNumber(randomNumber);
    } else {
      clearInterval(drawInterval);
      checkRanking(playerName);
    }
  }, 1000);
}

function displayNumber(number) {
  const numberElement = document.createElement("div");
  numberElement.className = "number";
  numberElement.textContent = number;
  numbersContainer.appendChild(numberElement);
}

function checkRanking(playerName) {
  const matchCount = userNumbers.filter(num => drawnNumbers.includes(num)).length;

  let resultMessage = `${playerName}님의 결과: `;
  if (matchCount === 6) {
    resultMessage += `1등 - 상금 ${PRIZES[1]}`;
    playerStats[playerName][1]++;
  } else if (matchCount === 5) {
    resultMessage += `2등 - 상금 ${PRIZES[2]}`;
    playerStats[playerName][2]++;
  } else if (matchCount === 4) {
    resultMessage += `3등 - 상금 ${PRIZES[3]}`;
    playerStats[playerName][3]++;
  } else if (matchCount === 3) {
    resultMessage += `4등 - 상금 ${PRIZES[4]}`;
    playerStats[playerName][4]++;
  } else if (matchCount === 2) {
    resultMessage += `5등 - 상금 ${PRIZES[5]}`;
    playerStats[playerName][5]++;
  } else {
    resultMessage += "아쉽지만 꽝입니다!";
    playerStats[playerName]["꽝"]++;
  }

  rankingDisplay.textContent = resultMessage;
  updateStats(playerName);
}

function updateStats(playerName) {
  const stats = playerStats[playerName];
  statsContainer.innerHTML = `
    <div class="stat-line"><strong>${playerName}</strong>의 기록:</div>
    <div class="stat-line">1등: ${stats[1]}회</div>
    <div class="stat-line">2등: ${stats[2]}회</div>
    <div class="stat-line">3등: ${stats[3]}회</div>
    <div class="stat-line">4등: ${stats[4]}회</div>
    <div class="stat-line">5등: ${stats[5]}회</div>
    <div class="stat-line">꽝: ${stats["꽝"]}회</div>
  `;
}
