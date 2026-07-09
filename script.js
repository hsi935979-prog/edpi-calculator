function calculateEDPI() {
    const dpi = document.getElementById('dpi').value;
    const sens = document.getElementById('sens').value;
    const resultDiv = document.getElementById('result');

    if (dpi > 0 && sens >= 0) {
        const edpi = dpi * sens;
        let comment = "";
        
        if (edpi < 400) {
            comment = " (저감도)";
        } else if (edpi < 800) {
            comment = " (중감도)";
        } else {
            comment = " (고감도)";
        }
        
        resultDiv.innerText = "당신의 eDPI는: " + edpi + comment;
    } else {
        resultDiv.innerText = "올바른 값을 입력해주세요!";
    }    
}