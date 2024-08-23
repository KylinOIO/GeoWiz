import { getAllCountries, getGeoguessrCountries } from '../countries.js';

const loadFlags = async (mode) => {
    let countries;
    if (mode === 'all') {
        countries = await getAllCountries();
    } else if (mode === 'geo') {
        countries = await getGeoguessrCountries();
    }

    const flagsGrid = document.getElementById('flags-grid');
    flagsGrid.innerHTML = ''; // 清空之前的内容

    countries.forEach((country) => {
        const countryNameZH =
            country.translations.zho?.common || country.name.common;

        const flagElement = document.createElement('div');
        flagElement.className = 'flag-item';
        flagElement.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100" height="67">
            <p>${countryNameZH} (${country.name.common})</p>
        `;

        flagsGrid.appendChild(flagElement);
    });
};

window.addEventListener('load', () => {
    const allButton = document.getElementById('all-button');
    const geoButton = document.getElementById('geo-button');

    allButton.addEventListener('click', () => {
        loadFlags('all');
    });

    geoButton.addEventListener('click', () => {
        loadFlags('geo');
    });

    // 默认加载“全部”模式
    loadFlags('all');
});
