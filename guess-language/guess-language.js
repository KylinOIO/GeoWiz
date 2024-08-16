import { incrementScore, resetScore } from '../utils.js';

// 从语言列表中随机选择n个不同的语言选项
const getRandomOptions = (languages, n) => {
    const options = [];
    while (options.length < n) {
        const randomLanguage =
            languages[Math.floor(Math.random() * languages.length)];
        // 确保不重复添加语言
        if (!options.includes(randomLanguage)) {
            options.push(randomLanguage);
        }
    }
    return options;
};

// 初始化猜语言模式的内容
export const loadLanguage = async () => {
    try {
        // 从API获取所有国家数据
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        // 随机选择一个国家
        const randomCountry =
            countries[Math.floor(Math.random() * countries.length)];

        // 获取该国家的官方语言
        const countryLanguages = Object.values(randomCountry.languages);

        // 随机选择一句话（假设每个国家数据中有一个sampleSentence字段，包含示例句子）
        const sampleSentence =
            randomCountry.sampleSentence || 'This is a sample sentence';

        // 获取四个随机语言选项，其中一个是正确答案
        const options = getRandomOptions(countryLanguages, 1);
        const wrongOptions = getRandomOptions(
            countries.flatMap((c) => Object.values(c.languages)),
            3
        );
        const finalOptions = [...options, ...wrongOptions].sort(
            () => Math.random() - 0.5
        );

        // 显示题目和选项
        document.getElementById(
            'question'
        ).innerText = `Which language is this: "${sampleSentence}"?`;
        finalOptions.forEach((language, index) => {
            document.getElementById(`option${index + 1}`).innerText = language;
            document.getElementById(`option${index + 1}`).onclick = () => {
                if (language === options[0]) {
                    incrementScore();
                    alert('Correct!');
                } else {
                    resetScore();
                    alert('Wrong!');
                }
                loadLanguage(); // 加载下一个问题
            };
        });
    } catch (error) {
        console.error('Error loading language data:', error);
    }
};
