import { incrementScore, resetScore } from '../utils.js';
import { getAllCountries, getGeoguessrCountries } from '../countries.js';

let isLoading = false; // 增加一个加载状态变量

const loadFlag = async (mode) => {
    if (isLoading) return; // 如果正在加载，直接返回，防止重复加载
    isLoading = true; // 设置为正在加载

    let countries;

    if (mode === 'geoguessr') {
        countries = await getGeoguessrCountries();
    } else {
        countries = await getAllCountries();
    }

    const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

    const flagContainer = document.getElementById('flag-container');
    const countryInput = document.getElementById('country-input');
    const submitButton = document.getElementById('submit-button');
    const skipButton = document.getElementById('skip-button');
    const suggestions = document.getElementById('country-suggestions');
    const answerDisplay = document.getElementById('answer-display');

    // 隐藏上一次的正确答案
    answerDisplay.style.display = 'none';
    answerDisplay.innerText = '';

    // 自动聚焦输入框
    countryInput.focus();

    // 设置国旗
    flagContainer.innerHTML = `<img src="${randomCountry.flags.png}" alt="Flag of ${randomCountry.name.common}" width="300" height="200">`;

    // 设置自动完成的国家列表
    suggestions.innerHTML = countries
        .map((country) => {
            const countryNameZH =
                country.translations.zho?.common || country.name.common;
            return `<option value="${countryNameZH} ${country.name.common}">${countryNameZH} ${country.name.common}</option>`;
        })
        .join('');

    // 提交答案事件
    const submitAnswer = () => {
        checkAnswer(countryInput.value.trim(), randomCountry, mode);
    };

    // 监听提交按钮
    submitButton.onclick = submitAnswer;

    // 监听跳过按钮
    skipButton.onclick = () => {
        showAnswer(randomCountry, mode); // 显示答案并等待下一题加载
    };

    // 监听Enter键提交
    countryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitAnswer();
        }
    });

    isLoading = false; // 加载完成后，设置为未加载状态
};

// 显示正确答案并延迟加载下一题
const showAnswer = (randomCountry, mode) => {
    const correctCountryZH =
        randomCountry.translations.zho?.common || randomCountry.name.common;
    const correctCountryEN = randomCountry.name.common;
    const answerDisplay = document.getElementById('answer-display');

    // 显示正确答案
    answerDisplay.style.display = 'block';
    answerDisplay.innerText = `正确答案: ${correctCountryZH} (${correctCountryEN})`;

    // 2秒后加载下一题
    setTimeout(() => {
        answerDisplay.style.display = 'none';
        loadFlag(mode); // 加载下一题
    }, 2000);
};

// 检查答案的逻辑
const checkAnswer = (input, randomCountry, mode) => {
    const correctCountryZH =
        randomCountry.translations.zho?.common || randomCountry.name.common;
    const correctCountryEN = randomCountry.name.common;

    if (input.includes(correctCountryEN) || input.includes(correctCountryZH)) {
        // 用户选择正确答案
        document.getElementById('country-input').style.backgroundColor =
            'green';
        incrementScore();
    } else {
        // 用户选择错误答案
        document.getElementById('country-input').style.backgroundColor = 'red';
    }

    // 显示正确答案并清除输入框
    showAnswer(randomCountry, mode);
    setTimeout(() => {
        document.getElementById('country-input').style.backgroundColor = '';
        document.getElementById('country-input').value = '';
    }, 2000);
};

window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('back-button');

    startButton.addEventListener('click', () => {
        const selectedMode = document.querySelector(
            'input[name="game-mode"]:checked'
        ).value;
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resetScore();
        loadFlag(selectedMode);
    });

    backButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetScore();
    });
});
