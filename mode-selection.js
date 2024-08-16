//mode-selcetion.js

import { loadDomain } from './guess-domain/guess-domain.js';
import { loadFlag } from './guess-flag/guess-flag.js';
import { loadLanguage } from './guess-language/guess-language.js';
import { incrementScore, resetScore } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const modeContainer = document.getElementById('mode-container');
    const flagDomainContainer = document.getElementById(
        'flag-domain-container'
    );
    const backButton = document.getElementById('back-button');
    const welcomeMessage = document.getElementById('welcome-message');

    // 模式选择按钮
    const guessFlagButton = document.getElementById('guess-flag');
    const guessDomainButton = document.getElementById('guess-domain');
    const guessLanguageButton = document.getElementById('guess-language');

    // 选择猜国旗模式
    guessFlagButton.addEventListener('click', () => {
        startGame();
        loadFlag(); // 加载国家模式
    });

    // 选择猜顶级域名模式
    guessDomainButton.addEventListener('click', () => {
        startGame();
        loadDomain(); // 加载顶级域名模式
    });

    // 选择猜语言模式
    guessLanguageButton.addEventListener('click', () => {
        startGame();
        loadLanguage(); // 加载语言模式
    });

    // 点击返回按钮时返回模式选择
    backButton.addEventListener('click', () => {
        flagDomainContainer.classList.add('hidden'); // 隐藏游戏区域
        modeContainer.classList.remove('hidden'); // 显示模式选择按钮
        welcomeMessage.classList.remove('hidden'); // 显示欢迎消息
        backButton.classList.add('hidden'); // 隐藏返回按钮
        resetScore(); // 重置得分
    });

    function startGame() {
        welcomeMessage.classList.add('hidden'); // 隐藏欢迎消息
        modeContainer.classList.add('hidden'); // 隐藏模式选择按钮
        flagDomainContainer.classList.remove('hidden'); // 显示游戏区域
        backButton.classList.remove('hidden'); // 显示返回按钮
    }
});
