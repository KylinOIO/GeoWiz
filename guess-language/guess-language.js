import { incrementScore, resetScore } from '../utils.js';

let languages = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score-container');

// 新增：开始界面和按钮的DOM元素
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const languageContainer = document.getElementById('language-container');

// 动态加载语言数据
async function loadLanguages() {
    try {
        const response = await fetch('languages.json');
        languages = await response.json();
    } catch (error) {
        console.error('加载语言数据时出错:', error);
    }
}

function generateQuestion() {
    currentQuestionIndex = Math.floor(Math.random() * languages.length);
    const correctLanguage = languages[currentQuestionIndex];

    const sentence =
        correctLanguage.options[
            Math.floor(Math.random() * correctLanguage.options.length)
        ];
    questionElement.textContent = `“${sentence}”`;

    let options = [correctLanguage];
    while (options.length < 4) {
        const randomLanguage =
            languages[Math.floor(Math.random() * languages.length)];
        if (!options.includes(randomLanguage)) {
            options.push(randomLanguage);
        }
    }

    options = shuffleArray(options);

    optionsContainer.innerHTML = options
        .map(
            (option) =>
                `<button class="option-button">${option.chineseName}<br>${option.name}</button>`
        )
        .join('');

    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach((button, index) => {
        button.style.backgroundColor = ''; // 清除按钮背景色
        button.addEventListener('click', () =>
            checkAnswer(options[index], button)
        );
    });
}

function checkAnswer(selectedOption, button) {
    const correctAnswer = languages[currentQuestionIndex];

    if (selectedOption.name === correctAnswer.name) {
        // 用户选择正确答案，按钮变为绿色
        button.style.backgroundColor = 'green';
        score++;
        incrementScore();

        // 2秒后自动生成下一题
        setTimeout(() => {
            generateQuestion();
        }, 2000);
    } else {
        // 用户选择错误答案，按钮变为红色
        button.style.backgroundColor = 'red';

        // 等待用户选择正确答案，不切换问题
        setTimeout(() => {
            button.style.backgroundColor = ''; // 2秒后重置颜色
        }, 2000);
    }

    updateScore();
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
    resetScore();
    score = 0;
    updateScore();
    generateQuestion();
}

// 新增：开始游戏函数，显示游戏界面并初始化游戏
function startGame() {
    startScreen.style.display = 'none';
    languageContainer.style.display = 'block';
    init();
}

// 新增：返回到开始界面并重置游戏
function returnToStartScreen() {
    languageContainer.style.display = 'none';
    startScreen.style.display = 'block';
    resetScore(); // 重置分数
    score = 0; // 确保分数归零
    updateScore(); // 更新分数显示
}

// 给“开始游戏”按钮绑定点击事件
startButton.addEventListener('click', startGame);

// 新增：给返回按钮绑定点击事件
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', returnToStartScreen);

// 加载语言数据
window.onload = loadLanguages;
