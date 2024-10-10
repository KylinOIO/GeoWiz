import { incrementScore, resetScore } from '../utils.js';

export const loadLanguage = async () => {
    try {
        const questionContainer = document.getElementById('question-container');
        const inputField = document.getElementById('country-input');
        const resultDisplay = document.getElementById('result-display');
        const submitButton = document.getElementById('submit-button');
        const skipButton = document.getElementById('skip-button');
        const datalistElement = document.getElementById('country-suggestions');

        // 确保所有需要的DOM元素都存在
        if (
            !questionContainer ||
            !inputField ||
            !resultDisplay ||
            !submitButton ||
            !skipButton ||
            !datalistElement
        ) {
            console.error('无法找到某些必要的元素');
            return;
        }

        // 获取语言选项
        const response = await fetch('./languages.json');
        if (!response.ok) {
            throw new Error('网络响应失败');
        }

        const languagesData = await response.json();

        // 生成 datalist 选项
        datalistElement.innerHTML = languagesData
            .map((language) => {
                const languageNameZH = language.chineseName; // 中文名
                const languageNameEN = language.name; // 英文名
                return `<option value="${languageNameZH} ${languageNameEN}">${languageNameZH} ${languageNameEN}</option>`;
            })
            .join('');

        // 随机选择一种语言
        const randomLanguage =
            languagesData[Math.floor(Math.random() * languagesData.length)];

        // 检查是否存在 options 属性，并且是数组
        if (!randomLanguage.options || !Array.isArray(randomLanguage.options)) {
            throw new Error('语言数据格式无效');
        }

        // 从选定的语言中随机选择一个句子
        const randomSentence =
            randomLanguage.options[
                Math.floor(Math.random() * randomLanguage.options.length)
            ];

        // 显示问题
        questionContainer.innerHTML = `<h2>${randomSentence}</h2>`;

        // 清空输入框
        inputField.value = '';
        inputField.style.backgroundColor = ''; // 清空输入框背景颜色
        resultDisplay.innerHTML = ''; // 清空结果显示区域

        // 移除旧的点击事件监听器，避免多次绑定
        submitButton.replaceWith(submitButton.cloneNode(true));
        skipButton.replaceWith(skipButton.cloneNode(true));

        // 添加按下Enter键的监听器
        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                submitButton.click(); // 模拟点击提交按钮
            }
        });

        // 提交答案的逻辑
        document
            .getElementById('submit-button')
            .addEventListener('click', () => {
                const userAnswer = inputField.value.trim().toLowerCase();
                const correctAnswer = randomLanguage.name.toLowerCase(); // 获取正确答案（语言名）

                if (
                    userAnswer.includes(correctAnswer) ||
                    userAnswer.includes(
                        randomLanguage.chineseName.toLowerCase()
                    )
                ) {
                    // 用户答案正确
                    resultDisplay.style.color = 'green';
                    resultDisplay.innerHTML = `正确! 答案是: ${randomLanguage.chineseName} (${correctAnswer})`;

                    inputField.style.backgroundColor = 'green'; // 输入框变为绿色
                    incrementScore(); // 分数+1

                    // 2秒后切换到下一题
                    setTimeout(() => {
                        loadLanguage(); // 加载下一个问题
                    }, 2000);
                } else {
                    // 用户答案错误
                    resultDisplay.style.color = 'red';
                    resultDisplay.innerHTML = `错误! 正确答案是: ${randomLanguage.chineseName} (${correctAnswer})`;

                    inputField.style.backgroundColor = 'red'; // 输入框变为红色

                    // 2秒后切换到下一题
                    setTimeout(() => {
                        loadLanguage(); // 加载下一个问题
                    }, 2000);
                }
            });

        // 跳过按钮的逻辑
        document.getElementById('skip-button').addEventListener('click', () => {
            loadLanguage(); // 立即加载下一个问题
        });
    } catch (error) {
        console.error('加载语言数据失败:', error);
        alert('加载语言数据失败: ' + error.message);
    }
};

// 游戏初始化及事件监听
window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('back-button');

    // 确保这些元素存在
    if (!startButton || !startScreen || !gameScreen || !backButton) {
        console.error('无法找到某些必要的元素');
        return;
    }

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resetScore();
        loadLanguage();
    });

    backButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetScore();
    });
});
