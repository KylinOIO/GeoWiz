// guess-domain.js
import { incrementScore, resetScore } from '../utils.js';

// 从国家列表中随机选择n个不同的国家
const getRandomOptions = (countries, n) => {
    const options = [];
    while (options.length < n) {
        const randomCountry =
            countries[Math.floor(Math.random() * countries.length)];
        // 确保不重复添加国家
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    return options;
};

// 初始化猜顶级域名模式的内容
export const loadDomain = async () => {
    try {
        // 从API获取所有国家数据
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        // 随机选择一个国家
        const randomCountry =
            countries[Math.floor(Math.random() * countries.length)];

        // 获取页面上的容器元素
        const flagContainer = document.getElementById('flag-container');
        const optionsContainer = document.getElementById('options-container');

        // 检查tld字段是否存在，并且是一个数组
        if (!randomCountry.tld || !Array.isArray(randomCountry.tld)) {
            console.error('无效的tld数据:', randomCountry);
            loadDomain(); // 重新加载题目
            return;
        }

        // 设置问题标题，显示随机国家的顶级域名
        flagContainer.innerHTML = `<h2>${randomCountry.tld[0]}</h2>`;

        // 获取三个随机国家作为选项，加上随机选中的国家，并打乱顺序
        const options = [randomCountry, ...getRandomOptions(countries, 3)].sort(
            () => Math.random() - 0.5
        );

        // 生成选项按钮，并在按钮上显示国家的中文名称和英文名称
        optionsContainer.innerHTML = options
            .map((country) => {
                const countryNameZH =
                    country.translations.zho?.common || country.name.common;
                return `<button>${countryNameZH}<br>${country.name.common}</button>`;
            })
            .join('');

        // 为每个按钮添加点击事件监听器
        optionsContainer.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                // 如果用户选择了正确的答案
                if (
                    button.textContent
                        .trim()
                        .includes(randomCountry.name.common)
                ) {
                    incrementScore(); // 增加分数
                    loadDomain(); // 加载下一题
                } else {
                    alert('错误！请再试一次。');
                }
            });
        });
    } catch (error) {
        console.error('加载国家数据失败:', error);
    }
};

// 在页面加载时调用 loadDomain 函数
loadDomain();
