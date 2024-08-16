// utils.js

// 增加分数（通用函数）
export const incrementScore = () => {
    let score = parseInt(
        document.getElementById('score-container').textContent.split(': ')[1]
    );
    score++;
    document.getElementById('score-container').textContent = `Score: ${score}`;
};

// 重置分数（通用函数）
export const resetScore = () => {
    document.getElementById('score-container').textContent = `Score: 0`;
};
