import { getAllCountries } from '../countries.js';

const loadFlags = async () => {
    const countries = await getAllCountries();
    const flagsGrid = document.getElementById('flags-grid');

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
    loadFlags();

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});
