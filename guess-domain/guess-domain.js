//guess-domain.js
import { incrementScore, resetScore } from '../utils.js';
import { getAllCountries, getGeoguessrCountries } from '../countries.js';

// 从国家列表中随机选择 n 个不同的国家
const getRandomOptions = (countries, n) => {
    const options = [];
    while (options.length < n) {
        const randomCountry =
            countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    return options;
};

export const loadDomain = async () => {
    try {
        const flagContainer = document.getElementById('flag-container');
        const optionsContainer = document.getElementById('options-container');

        // 获取被选中的游戏模式
        const mode = document.querySelector(
            'input[name="game-mode"]:checked'
        ).value;

        let countries;
        if (mode === 'geoguessr') {
            countries = await getGeoguessrCountries();
        } else {
            countries = await getAllCountries();
        }

        const randomCountry =
            countries[Math.floor(Math.random() * countries.length)];

        if (!randomCountry.tld || !Array.isArray(randomCountry.tld)) {
            console.error('无效的tld数据:', randomCountry);
            loadDomain();
            return;
        }

        flagContainer.innerHTML = `<h2>${randomCountry.tld[0]}</h2>`;

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
                if (
                    button.textContent
                        .trim()
                        .includes(randomCountry.name.common)
                ) {
                    incrementScore();
                } else {
                    alert(`错误！正确答案是 ${randomCountry.name.common}.`);
                    resetScore();
                }
                loadDomain();
            });
        });
    } catch (error) {
        console.error('加载国家数据失败:', error);
    }
};

window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('back-button');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resetScore();
        loadDomain();
    });

    backButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetScore();
    });
});
