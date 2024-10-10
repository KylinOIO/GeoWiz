//guess-flag.js
import { incrementScore, resetScore } from '../utils.js';
import { getAllCountries, getGeoguessrCountries } from '../countries.js';

const loadFlag = async (mode) => {
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
        showAnswer(randomCountry);
        setTimeout(() => {
            loadFlag(mode);
        }, 2000);
    };

    // 监听Enter键提交
    countryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitAnswer();
        }
    });
};

// 显示正确答案
const showAnswer = (randomCountry) => {
    const correctCountryZH =
        randomCountry.translations.zho?.common || randomCountry.name.common;
    const correctCountryEN = randomCountry.name.common;
    const answerDisplay = document.getElementById('answer-display');

    answerDisplay.style.display = 'block';
    answerDisplay.innerText = `正确答案: ${correctCountryZH} (${correctCountryEN})`;
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
        setTimeout(() => {
            document.getElementById('country-input').style.backgroundColor = '';
            document.getElementById('country-input').value = '';
            loadFlag(mode);
        }, 2000);
    } else {
        // 用户选择错误答案
        document.getElementById('country-input').style.backgroundColor = 'red';
        showAnswer(randomCountry); // 显示正确答案
        setTimeout(() => {
            document.getElementById('country-input').style.backgroundColor = '';
            document.getElementById('country-input').value = '';
            loadFlag(mode);
        }, 2000);
    }
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
