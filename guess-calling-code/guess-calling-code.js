import { incrementScore, resetScore } from '../utils.js';

let countryCodes = [];
let currentQuestionIndex = 0;
let score = 0;

const callingCodeQuestionContainer = document.getElementById(
    'calling-code-question-container'
);
const answerDisplay = document.getElementById('answer-display');
const countryInput = document.getElementById('country-input');
const suggestionsList = document.getElementById('country-suggestions');
const submitButton = document.getElementById('submit-button');
const skipButton = document.getElementById('skip-button');
const scoreElement = document.getElementById('score-container');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const callingCodeContainer = document.getElementById('calling-code-container');

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
        callingCodeQuestionContainer.textContent = '加载数据失败，请稍后再试。';
    }
}

function generateQuestion() {
    if (countryCodes.length === 0) return; // 确保数据加载完成
    currentQuestionIndex = Math.floor(Math.random() * countryCodes.length);
    const correctCode = countryCodes[currentQuestionIndex];

    callingCodeQuestionContainer.textContent = `.${correctCode.code}`;

    countryInput.value = '';
    suggestionsList.innerHTML = '';
    answerDisplay.textContent = ''; // 清空上次答案

    countryInput.addEventListener('input', updateSuggestions);
}

function updateSuggestions() {
    const inputVal = countryInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (inputVal) {
        const matchingCountries = countryCodes.filter(({ countryName }) =>
            countryName.toLowerCase().includes(inputVal)
        );

        matchingCountries.forEach(({ countryName }) => {
            const option = document.createElement('option');
            option.value = countryName;
            suggestionsList.appendChild(option);
        });
    }
}

function checkAnswer() {
    const selectedOption = countryInput.value.trim();
    const correctAnswer = countryCodes[currentQuestionIndex];

    if (selectedOption === correctAnswer.countryName) {
        countryInput.style.backgroundColor = 'green';
        score++;
        updateScore();
        setTimeout(() => {
            generateQuestion(); // 2秒后生成新问题
            countryInput.style.backgroundColor = ''; // 重置输入框背景色
        }, 2000);
    } else {
        countryInput.style.backgroundColor = 'red';
        answerDisplay.textContent = `错误！正确答案是：${correctAnswer.countryName}`; // 显示正确答案
        setTimeout(() => {
            countryInput.style.backgroundColor = ''; // 重置输入框背景色
            generateQuestion(); // 显示答案后再生成下一个问题
        }, 2000);
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function init() {
    score = 0;
    updateScore();
}

function startGame() {
    startScreen.style.display = 'none'; // 隐藏启动界面
    document.getElementById('game-screen').style.display = 'block'; // 显示游戏界面
    callingCodeContainer.style.display = 'flex'; // 确保内容显示
    init();
    generateQuestion(); // 启动时生成第一个问题
}

function returnToStartScreen() {
    callingCodeContainer.style.display = 'none'; // 隐藏游戏界面
    startScreen.style.display = 'flex'; // 显示启动界面
    score = 0;
    updateScore();
    callingCodeQuestionContainer.textContent = '';
    answerDisplay.textContent = '';
}

startButton.addEventListener('click', startGame);
document
    .getElementById('back-button')
    .addEventListener('click', returnToStartScreen);

submitButton.addEventListener('click', checkAnswer);
skipButton.addEventListener('click', generateQuestion);

window.addEventListener('DOMContentLoaded', async () => {
    await loadCountryCodes(); // 等待数据加载完成
});
