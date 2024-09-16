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
    const optionsContainer = document.getElementById('options-container');

    flagContainer.innerHTML = `<img src="${randomCountry.flags.png}" alt="Flag of ${randomCountry.name.common}" width="300" height="200">`;

    const options = [randomCountry, ...getRandomOptions(countries, 3)].sort(
        () => Math.random() - 0.5
    );

    optionsContainer.innerHTML = options
        .map((country) => {
            const countryNameZH =
                country.translations.zho?.common || country.name.common;
            return `<button class="option-button">${countryNameZH}<br>${country.name.common}</button>`;
        })
        .join('');

    optionsContainer.querySelectorAll('button').forEach((button) => {
        button.style.backgroundColor = ''; // 清除按钮背景色
        button.addEventListener('click', () => {
            const correctCountryZH =
                randomCountry.translations.zho?.common ||
                randomCountry.name.common;
            const correctCountryEN = randomCountry.name.common;

            if (button.textContent.includes(correctCountryEN)) {
                // 用户选择正确答案，按钮变为绿色
                button.style.backgroundColor = 'green';
                incrementScore();

                setTimeout(() => {
                    loadFlag(mode); // 2秒后加载下一个问题
                }, 2000);
            } else {
                // 用户选择错误答案，按钮变为红色
                button.style.backgroundColor = 'red';
                setTimeout(() => {
                    button.style.backgroundColor = ''; // 重置颜色
                }, 2000); // 等待用户选择正确答案
            }
        });
    });
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
