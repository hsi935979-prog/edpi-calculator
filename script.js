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

function convertToValorant() {
    const sourceGame = document.getElementById('source-game').value;
    const sourceDPI = document.getElementById('source-dpi').value;
    const sourceSens = document.getElementById('source-sens').value;
    const valorantResult = document.getElementById('valorant-result');
    
    if (!sourceGame) {
        valorantResult.innerText = "원본 게임을 선택해주세요.";
        return;
    }
    
    if (sourceDPI <= 0 || sourceSens <= 0) {
        valorantResult.innerText = "올바른 DPI와 감도를 입력해주세요.";
        return;
    }
    
    // 원본 게임의 eDPI 계산
    const sourceEDPI = sourceDPI * sourceSens;
    
    // 발로란트 감도 계산 (eDPI / 사용자 DPI)
    // 사용자가 발로란트에서도 같은 DPI를 사용한다고 가정
    const valorantSens = (sourceEDPI / sourceDPI).toFixed(3);
    
    let gameName = "";
    switch(sourceGame) {
        case 'overwatch':
            gameName = "오버워치";
            break;
        case 'apex':
            gameName = "에이펙스 레전드";
            break;
        case 'csgo':
            gameName = "CS:GO/CS2";
            break;
        case 'fortnite':
            gameName = "포트나이트";
            break;
    }
    
    valorantResult.innerText = `${gameName} 감도 ${sourceSens} → 발로란트 감도: ${valorantSens}`;
    
    // 발로란트 감도로 자동 저장
    const valorantEDPI = sourceDPI * valorantSens;
    saveSensitivity(sourceDPI, valorantSens, valorantEDPI);
}

// 저장된 설정 관리
function saveSensitivity(dpi, sens, edpi) {
    if (dpi <= 0 || sens <= 0) {
        return;
    }
    
    // localStorage에서 기존 설정 가져오기
    let settings = JSON.parse(localStorage.getItem('edpiSettings')) || [];
    
    // 중복 체크 (같은 DPI와 감도가 이미 있는지 확인)
    const isDuplicate = settings.some(setting => 
        setting.dpi == dpi && setting.sens == sens
    );
    
    if (isDuplicate) {
        return; // 중복이면 저장하지 않음
    }
    
    const now = new Date();
    const dateString = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const setting = {
        id: Date.now(),
        date: dateString,
        dpi: dpi,
        sens: sens,
        edpi: edpi
    };
    
    settings.unshift(setting); // 최신 설정을 맨 앞에 추가
    
    // 최대 10개만 저장
    if (settings.length > 10) {
        settings = settings.slice(0, 10);
    }
    
    localStorage.setItem('edpiSettings', JSON.stringify(settings));
    loadSettings();
}

function saveSettings() {
    const dpi = document.getElementById('dpi').value;
    const sens = document.getElementById('sens').value;
    
    if (dpi <= 0 || sens <= 0) {
        alert('올바른 DPI와 감도를 입력해주세요.');
        return;
    }
    
    const edpi = dpi * sens;
    saveSensitivity(dpi, sens, edpi);
    alert('설정이 저장되었습니다.');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('edpiSettings')) || [];
    const tbody = document.getElementById('settings-body');
    tbody.innerHTML = '';
    
    if (settings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">저장된 설정이 없습니다.</td></tr>';
        return;
    }
    
    settings.forEach(setting => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${setting.date}</td>
            <td>${setting.dpi}</td>
            <td>${setting.sens}</td>
            <td>${setting.edpi}</td>
            <td><button class="delete-btn" onclick="deleteSetting(${setting.id})"><i data-lucide="trash-2"></i></button></td>
        `;
        tbody.appendChild(row);
    });
    
    lucide.createIcons();
}

function deleteSetting(id) {
    let settings = JSON.parse(localStorage.getItem('edpiSettings')) || [];
    settings = settings.filter(setting => setting.id !== id);
    localStorage.setItem('edpiSettings', JSON.stringify(settings));
    loadSettings();
}

// 페이지 로드 시 저장된 설정 표시
window.onload = function() {
    loadSettings();
};