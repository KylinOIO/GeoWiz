// guess-flag.js

import { incrementScore, resetScore } from '../utils.js';

// 初始化猜国家模式的内容
export const loadFlag = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

    const flagContainer = document.getElementById('flag-container');
    const optionsContainer = document.getElementById('options-container');
    const scoreContainer = document.getElementById('score-container');

    flagContainer.innerHTML = `<img src="${randomCountry.flags.png}" alt="Flag of ${randomCountry.name.common}" width="300" height="200">`;

    const options = [randomCountry, ...getRandomOptions(countries, 3)].sort(
        () => Math.random() - 0.5
    );

    optionsContainer.innerHTML = options
        .map((country) => {
            const countryNameZH =
                country.translations.zho?.common || country.name.common;
            return `<button>${countryNameZH}<br>${country.name.common}</button>`;
        })
        .join('');

    optionsContainer.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.textContent.includes(randomCountry.name.common)) {
                incrementScore();
                loadFlag(); // 加载下一轮的国家旗帜
            } else {
                alert('错误！请再试一次。');
            }
        });
    });
};

// 在页面加载时调用 loadFlag 函数
loadFlag();

// 从所有国家列表中随机选择指定数量的不重复国家作为错误选项
const getRandomOptions = (countries, num) => {
    const selectedOptions = [];
    while (selectedOptions.length < num) {
        const randomOption =
            countries[Math.floor(Math.random() * countries.length)];
        if (!selectedOptions.includes(randomOption)) {
            selectedOptions.push(randomOption);
        }
    }
    return selectedOptions;
};

// 更新页面上的分数显示
const updateScoreDisplay = () => {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.textContent = `当前得分: ${score}`;
};

// 在页面加载时调用 loadFlag 函数并重置分数
window.addEventListener('load', () => {
    resetScore();
    loadFlag();
});
