// Question configuration organized by match phases
const matchConfig = {
    general: [
        { 
            id: "teamNumber", 
            label: "Team Number", 
            type: "number", 
            defaultValue: 0 
        },
        { 
            id: "matchNumber", 
            label: "Match Number", 
            type: "number", 
            defaultValue: 1 
        }
    ],
    autonomous: [
        {
            id: "autoLeave",
            label: "Did the robot leave its starting zone during autonomous?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        },
        {
            id: "autoCoralScored",
            label: "How many Coral pieces scored on Reef in autonomous?",
            type: "number",
            defaultValue: 0,
            min: 0
        },
        {
            id: "autoAlgae",
            label: "Did the robot dislodge Algae in autonomous?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        },
        
        {
            id: "autoRankingPoint",
            label: "Did the alliance earn the auto ranking point?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        }
    ],
    teleop: [
        {
            id: "teleopCoralScored",
            label: "How many Coral pieces scored during teleop?",
            type: "number",
            defaultValue: 0,
            min: 0
        },
        {
            id: "processorInteraction",
            label: "Did the robot interact with the Processor for Algae?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        },
        {
            id: "algaeScored",
            label: "How many Algae scored in Processor/Barge?",
            type: "number",
            defaultValue: 0,
            min: 0
        },
        {
            id: "coralCollection",
            label: "Rate Coral collection effectiveness (1-5)",
            type: "number",
            defaultValue: 1,
            min: 1,
            max: 5
        }
    ],
    endgame: [
        {
            id: "cageType",
            label: "Did the team choose a shallow or deep cage?",
            type: "boolean",
            options: ["Shallow", "Deep"],
            defaultValue: "Shallow"
        },
        {
            id: "cageAttach",
            label: "Did the robot attach to a Cage?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        },
        {
            id: "bargeParking",
            label: "Was the robot parked under the Barge?",
            type: "boolean",
            options: ["Yes", "No"],
            defaultValue: "No"
        }
    ],
    performance: [
        {
            id: "overallPerformance",
            label: "Rate overall performance (1-10)",
            type: "number",
            defaultValue: 5,
            min: 1,
            max: 10
        }
    ]
};

let selectedValues = {};

function initializeForm() {
    const container = document.body;
    
    container.innerHTML = '<h1 class="main-titles">Falcon Scout</h1>';
    
    Object.entries(matchConfig).forEach(([phase, questions]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        const header = document.createElement('h2');
        header.className = 'phase-header';
        header.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
        sectionDiv.appendChild(header);
        
        questions.forEach(question => {
            const questionDiv = createQuestionElement(question);
            sectionDiv.appendChild(questionDiv);
        });
        
        container.appendChild(sectionDiv);
    });
    
    addControlButtons(container);
}

function createQuestionElement(question) {
    const div = document.createElement('div');
    div.className = 'question-container';
    
    const label = document.createElement('h3');
    label.className = 'titles';
    label.textContent = question.label;
    div.appendChild(label);
    
    if (question.type === "number") {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const subtractBtn = createButton("input-subtraction-button", () => adjustValue(question.id, -1));
        const input = createNumberInput(question);
        const addBtn = createButton("input-addition-button", () => adjustValue(question.id, 1));
        
        inputGroup.append(subtractBtn, input, addBtn);
        div.appendChild(inputGroup);
    } else if (question.type === "boolean") {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        
        question.options.forEach(option => {
            const button = createButton("general-button", () => selectOption(question.id, option));
            button.textContent = option;
            button.id = `${question.id}-${option.toLowerCase()}`;
            buttonGroup.appendChild(button);
        });
        
        div.appendChild(buttonGroup);
    }
    
    return div;
}

function createNumberInput(question) {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'titles';
    input.id = `${question.id}-input`;
    input.value = question.defaultValue;
    input.min = question.min !== undefined ? question.min : 0;
    input.max = question.max !== undefined ? question.max : undefined;
    
    input.addEventListener('input', () => validateInput(question));
    return input;
}

function createButton(className, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

function validateInput(question) {
    const input = document.getElementById(`${question.id}-input`);
    let value = parseInt(input.value) || question.defaultValue;
    
    if (question.min !== undefined) value = Math.max(value, question.min);
    if (question.max !== undefined) value = Math.min(value, question.max);
    
    input.value = value;
    selectedValues[question.id] = value;
}

function adjustValue(id, delta) {
    const input = document.getElementById(`${id}-input`);
    const question = findQuestionById(id);
    let value = parseInt(input.value) || question.defaultValue;
    
    value += delta;
    if (question.min !== undefined) value = Math.max(value, question.min);
    if (question.max !== undefined) value = Math.min(value, question.max);
    
    input.value = value;
    selectedValues[id] = value;
}

function selectOption(id, option) {
    const buttons = document.querySelectorAll(`[id^="${id}-"]`);
    buttons.forEach(button => button.classList.remove('highlighted'));
    
    const selectedButton = document.getElementById(`${id}-${option.toLowerCase()}`);
    selectedButton.classList.add('highlighted');
    selectedValues[id] = option;
}

function findQuestionById(id) {
    for (const section of Object.values(matchConfig)) {
        const question = section.find(q => q.id === id);
        if (question) return question;
    }
    return null;
}

function generateQRCode() {
    const qrData = [];
    
    Object.values(matchConfig).forEach(questions => {
        questions.forEach(question => {
            const value = selectedValues[question.id] || question.defaultValue;
            qrData.push(value);
        });
    });
    
    const qrString = qrData.join('|');
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, qrString);
}

function clearForm() {
    selectedValues = {};
    
    Object.values(matchConfig).forEach(questions => {
        questions.forEach(question => {
            if (question.type === "number") {
                const input = document.getElementById(`${question.id}-input`);
                input.value = question.defaultValue;
            } else if (question.type === "boolean") {
                const buttons = document.querySelectorAll(`[id^="${question.id}-"]`);
                buttons.forEach(button => button.classList.remove('highlighted'));
            }
        });
    });
    
    document.getElementById('qrcode').innerHTML = '';
}

function addControlButtons(container) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'control-buttons';
    
    const generateButton = createButton("input-submit-button", generateQRCode);
    generateButton.textContent = " ";
    
    const clearButton = createButton("end-button", clearForm);
    clearButton.textContent = "Clear All Fields";
    
    const qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode';
    qrContainer.className = 'qrcode';
    
    buttonContainer.append(generateButton, clearButton, qrContainer);
    container.appendChild(buttonContainer);
}

document.addEventListener('DOMContentLoaded', initializeForm);