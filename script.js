let currentEDPI = 0;

function calculateEDPI() {
    const dpi = document.getElementById('dpi').value;
    const sens = document.getElementById('sens').value;
    const resultDiv = document.getElementById('result');
    const gaugeBar = document.getElementById('gauge-bar');

    if (dpi > 0 && sens >= 0) {
        const edpi = dpi * sens;
        currentEDPI = edpi;
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
        
        // 게임 선택이 이미 되어있다면 변환 결과 업데이트
        const gameSelect = document.getElementById('game-select');
        if (gameSelect.value) {
            convertSensitivity();
        }
    } else {
        resultDiv.innerText = "올바른 값을 입력해주세요!";
        resultDiv.style.color = "#ff6b6b";
        gaugeBar.style.width = "0%";
        currentEDPI = 0;
    }    
}

function convertSensitivity() {
    const gameSelect = document.getElementById('game-select');
    const convertedResult = document.getElementById('converted-result');
    const selectedGame = gameSelect.value;
    
    if (currentEDPI === 0) {
        convertedResult.innerText = "먼저 eDPI를 계산해주세요.";
        return;
    }
    
    if (!selectedGame) {
        convertedResult.innerText = "게임을 선택해주세요.";
        return;
    }
    
    let convertedSens = 0;
    let gameName = "";
    
    // 게임별 감도 변환 (eDPI 기준, 800 DPI 기준)
    switch(selectedGame) {
        case 'valorant':
            convertedSens = (currentEDPI / 800).toFixed(2);
            gameName = "발로란트";
            break;
        case 'overwatch':
            convertedSens = (currentEDPI / 800).toFixed(2);
            gameName = "오버워치";
            break;
        case 'apex':
            convertedSens = (currentEDPI / 800).toFixed(2);
            gameName = "에이펙스 레전드";
            break;
    }
    
    convertedResult.innerText = `${gameName} 추천 감도: ${convertedSens}`;
}

// 게임 선택 변경 시 자동 변환
document.getElementById('game-select').addEventListener('change', convertSensitivity);