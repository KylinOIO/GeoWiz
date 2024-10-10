import { incrementScore, resetScore } from '../utils.js';
import { getAllCountries, getGeoguessrCountries } from '../countries.js';

let currentCountry = null; // 保存当前的国家信息

const loadDomain = async () => {
    try {
        const domainContainer = document.getElementById('flag-container');
        const inputField = document.getElementById('country-input');
        const suggestionList = document.getElementById('country-suggestions');
        const answerDisplay = document.getElementById('answer-display');

        const mode = document.querySelector(
            'input[name="game-mode"]:checked'
        ).value;

        let countries;
        if (mode === 'geoguessr') {
            countries = await getGeoguessrCountries();
        } else {
            countries = await getAllCountries();
        }

        currentCountry =
            countries[Math.floor(Math.random() * countries.length)];

        if (!currentCountry.tld || !Array.isArray(currentCountry.tld)) {
            console.error('无效的tld数据:', currentCountry);
            loadDomain();
            return;
        }

        domainContainer.innerHTML = `<h2>${currentCountry.tld[0]}</h2>`;
        inputField.value = '';
        suggestionList.innerHTML = '';
        answerDisplay.textContent = '';
        answerDisplay.style.display = 'none';

        inputField.focus();

        inputField.addEventListener('input', () => {
            const query = inputField.value.toLowerCase();
            const matches = countries.filter((country) => {
                const countryNameZH = country.translations.zho?.common || '';
                const countryNameEN = country.name.common || '';
                return (
                    countryNameZH.toLowerCase().includes(query) ||
                    countryNameEN.toLowerCase().includes(query)
                );
            });

            suggestionList.innerHTML = matches
                .map((country) => {
                    const countryNameZH =
                        country.translations.zho?.common || '';
                    const countryNameEN = country.name.common || '';
                    return `<option value="${countryNameZH}">${countryNameZH} (${countryNameEN})</option>`;
                })
                .join('');
        });
    } catch (error) {
        console.error('加载国家数据失败:', error);
    }
};

const submitAnswer = () => {
    const inputField = document.getElementById('country-input');
    const answerDisplay = document.getElementById('answer-display');
    const userInput = inputField.value.trim().toLowerCase();
    const correctCountryZH =
        currentCountry.translations.zho?.common || currentCountry.name.common;
    const correctCountryEN = currentCountry.name.common;

    if (
        userInput === correctCountryZH.toLowerCase() ||
        userInput === correctCountryEN.toLowerCase()
    ) {
        inputField.style.backgroundColor = 'green';
        incrementScore();
        answerDisplay.textContent = `正确答案：${correctCountryZH} (${correctCountryEN})`;
        answerDisplay.style.display = 'block';
    } else {
        inputField.style.backgroundColor = 'red';
        answerDisplay.textContent = `正确答案：${correctCountryZH} (${correctCountryEN})`;
        answerDisplay.style.display = 'block';
    }

    setTimeout(() => {
        inputField.style.backgroundColor = '';
        inputField.value = '';
        loadDomain();
    }, 2000);
};

window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const backButton = document.getElementById('back-button');

    startButton.addEventListener('click', () => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        resetScore();
        loadDomain();
    });

    backButton.addEventListener('click', () => {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        resetScore();
    });

    document
        .getElementById('submit-button')
        .addEventListener('click', submitAnswer);

    document
        .getElementById('country-input')
        .addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                submitAnswer();
            }
        });

    document.getElementById('skip-button').addEventListener('click', () => {
        const answerDisplay = document.getElementById('answer-display');
        answerDisplay.textContent = `正确答案：${currentCountry.translations.zho?.common} (${currentCountry.name.common})`;
        answerDisplay.style.display = 'block';
        setTimeout(() => {
            answerDisplay.style.display = 'none';
            loadDomain();
        }, 2000);
    });
});
