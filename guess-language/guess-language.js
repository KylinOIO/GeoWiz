import { incrementScore, resetScore } from '../utils.js';

let languages = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score-container');

// 动态加载语言数据
async function loadLanguages() {
    try {
        const response = await fetch('languages.json');
        languages = await response.json();
        init(); // 在数据加载完成后初始化游戏
    } catch (error) {
        console.error('加载语言数据时出错:', error);
    }
}

function generateQuestion() {
    currentQuestionIndex = Math.floor(Math.random() * languages.length);
    const correctLanguage = languages[currentQuestionIndex];

    // 随机选择一个句子作为题目
    const sentence =
        correctLanguage.options[
            Math.floor(Math.random() * correctLanguage.options.length)
        ];
    questionElement.textContent = sentence;

    let options = [correctLanguage];
    while (options.length < 4) {
        const randomLanguage =
            languages[Math.floor(Math.random() * languages.length)];
        if (!options.includes(randomLanguage)) {
            options.push(randomLanguage);
        }
    }

    options = shuffleArray(options);

    // 动态生成选项按钮
    optionsContainer.innerHTML = options
        .map(
            (option) =>
                `<button class="option-button">${option.chineseName}<br>${option.name}</button>`
        )
        .join('');

    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach((button, index) => {
        button.addEventListener('click', () =>
            checkAnswer(options[index].name)
        );
    });
}

function checkAnswer(selectedOption) {
    const correctAnswer = languages[currentQuestionIndex].name;
    if (selectedOption === correctAnswer) {
        incrementScore();
        score++;
    } else {
        alert(`错误！正确答案是 ${correctAnswer}。`);
        resetScore();
        score = 0;
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
    resetScore();
    score = 0;
    updateScore();
    generateQuestion();
}

window.onload = loadLanguages;
