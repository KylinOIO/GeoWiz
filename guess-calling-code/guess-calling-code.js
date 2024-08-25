import { incrementScore, resetScore } from '../utils.js';

let countryCodes = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score-container');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const callingCodeContainer = document.getElementById('flag-domain-container');

// 动态加载电话区号数据
async function loadCountryCodes() {
    try {
        const response = await fetch('./country-codes.json'); // 确保路径正确
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        countryCodes = await response.json();
        console.log('Loaded country codes:', countryCodes);
        startButton.disabled = false; // 加载完数据后启用开始按钮
    } catch (error) {
        console.error('加载电话区号数据时出错:', error);
        questionElement.textContent = '加载数据失败，请稍后再试。';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    startButton.disabled = true; // 禁用开始按钮直到数据加载完成
    await loadCountryCodes(); // 等待数据加载完成
});

function generateQuestion() {
    if (countryCodes.length === 0) return; // 确保数据加载完成
    currentQuestionIndex = Math.floor(Math.random() * countryCodes.length);
    const correctCode = countryCodes[currentQuestionIndex];

    questionElement.textContent = `哪个国家的电话区号是 “${correctCode.code}”？`;

    let options = [correctCode];
    while (options.length < 4) {
        const randomCode =
            countryCodes[Math.floor(Math.random() * countryCodes.length)];
        if (
            !options.some(
                (option) => option.countryName === randomCode.countryName
            )
        ) {
            options.push(randomCode);
        }
    }

    options = shuffleArray(options);

    optionsContainer.innerHTML = options
        .map(
            (option) =>
                `<button class="option-button">
                <div>${option.chineseName}</div>
                <div>${option.countryName}</div>
            </button>`
        )
        .join('');

    document.querySelectorAll('.option-button').forEach((button) => {
        button.addEventListener('click', (e) =>
            checkAnswer(e.target.textContent)
        );
    });
}

function checkAnswer(selectedOption) {
    const correctAnswer = countryCodes[currentQuestionIndex];
    if (selectedOption === correctAnswer.countryName) {
        score++;
    } else {
        alert(`错误！正确答案是 ${correctAnswer.countryName}`);
        score = 0; // 简化分数重置逻辑
    }
    updateScore();
    generateQuestion();
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function init() {
    score = 0;
    updateScore();
}

function startGame() {
    startScreen.style.display = 'none'; // 隐藏启动界面
    document.getElementById('game-screen').style.display = 'block'; // 确保游戏界面显示
    callingCodeContainer.style.display = 'flex'; // 确保内容显示
    init();
    generateQuestion(); // 启动时生成第一个问题
}

function returnToStartScreen() {
    callingCodeContainer.style.display = 'none'; // 隐藏游戏界面
    startScreen.style.display = 'flex'; // 显示启动界面
    score = 0;
    updateScore();
    questionElement.textContent = '';
    optionsContainer.innerHTML = '';
}

startButton.addEventListener('click', startGame);
document
    .getElementById('back-button')
    .addEventListener('click', returnToStartScreen);

window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('back-button');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resetScore();
        loadCountryCodes();
    });

    backButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetScore();
    });
});
