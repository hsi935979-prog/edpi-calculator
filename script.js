function calculateEDPI() {
    const dpi = document.getElementById('dpi').value;
    const sens = document.getElementById('sens').value;
    const resultDiv = document.getElementById('result');
    const gaugeBar = document.getElementById('gauge-bar');

    if (dpi > 0 && sens >= 0) {
        const edpi = dpi * sens;
        let comment = "";
        let color = "";
        
        if (edpi < 400) {
            comment = " (저감도)";
            color = "#4a90e2"; // 파란색
        } else if (edpi < 800) {
            comment = " (중감도)";
            color = "#00ff9d"; // 녹색
        } else {
            comment = " (고감도)";
            color = "#ff6b6b"; // 빨간색
        }
        
        resultDiv.innerText = "당신의 eDPI는: " + edpi + comment;
        resultDiv.style.color = color;
        resultDiv.style.textShadow = `0 0 10px ${color}80`;
        
        // 게이지바 업데이트 (최대 1200 기준)
        const maxEDPI = 1200;
        const percentage = Math.min((edpi / maxEDPI) * 100, 100);
        gaugeBar.style.width = percentage + "%";
        gaugeBar.style.background = color;
    } else {
        resultDiv.innerText = "올바른 값을 입력해주세요!";
        resultDiv.style.color = "#ff6b6b";
        gaugeBar.style.width = "0%";
    }    
}