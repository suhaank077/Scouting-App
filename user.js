// Array with stuff
const questions = ["match", "team", "speaker", "amp", "speed"]
var coopertitionString = "";
var highlightedButtons = {};
// Annoying button logic
function addition(element) {
    // alert(element.id);
    document.getElementById(element.id + "input").value = parseInt(document.getElementById(element.id + "input").value) + 1;
}

function subtraction(element) {
    document.getElementById(element.id + "input").value = parseInt(document.getElementById(element.id + "input").value) - 1;
}


// html is mid 
function getInputValue(element) {
    var inputVal = document.getElementById(element + "input").value;
    // alert(inputVal);
    return inputVal;
}

function getQRCodeString() {
    let qrCodeString = "";
    for (i = 0; i < questions.length; i++) {
        qrCodeString += getInputValue(questions[i]) + "|";
    }
    return qrCodeString;
}

function generateQRCode() {
    let qrCodeString = "";
    for (i = 0; i < questions.length; i++) {
        qrCodeString += getInputValue(questions[i]) + "|";
    }
    // alert(qrCodeString);
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), qrCodeString);
}

function coopertition(element){coopertitionString = element.includes("yes") === true ? "Yes": "No";}


function unhighlightButtons(){
    var buttons = document.querySelectorAll('.general-button, .num-button');
    buttons.forEach(function(button) {
        button.classList.remove('highlighted');
    });
}

function highlightButton(sectionId, button) {
    var currentHighlightedButton = highlightedButtons[sectionId];
    if (currentHighlightedButton) {currentHighlightedButton.classList.remove('highlighted');}
    button.classList.add('highlighted');
    highlightedButtons[sectionId] = button;
}   