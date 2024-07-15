let calcArr = [];
let prevAns = 0;
let currCharPos = -1;

const calcScreen = document.querySelector("canvas");
const calcContext = calcScreen.getContext("2d")
const TEXT_FONT = "38px serif";
calcContext.font = TEXT_FONT;

const SCREEN_WIDTH = getComputedStyle(calcScreen).width;
const SCREEN_HEIGHT = getComputedStyle(calcScreen).height;
const SCREEN_WIDTH_NUMBER = +SCREEN_WIDTH.split("").slice(0, -2).join("")
const SCREEN_HEIGHT_NUMBER = +SCREEN_HEIGHT.split("").slice(0, -2).join("")
const STARTING_X_POS = 9;
const ELEMENTS_GAP = calcContext.measureText("6").width + 4; //4 is added to make space for target line and 6 is used for common width among numbers
const DRAW_EQU_Y = 50;
const TARGET_LINE_INTERVAL = 0.5; //interval in seconds
const RESULT_Y_POS = 180;

let drawX = STARTING_X_POS;
let prevX = STARTING_X_POS;
let ans = 1;


calcScreen.setAttribute("width", SCREEN_WIDTH);
calcScreen.setAttribute("height", SCREEN_HEIGHT);

function createCalcBtns() {
    function createFunctBtns() {
        const arrowsDiv = document.querySelector("#left-right-buttons");
        const clearDiv = document.querySelector("#on-of-button");
        const arrowLeftBtn = Button();
        const arrowRightBtn = Button();
        const clearBtn = Button();

        arrowLeftBtn.textContent = "<";
        arrowRightBtn.textContent = ">";
        clearBtn.textContent = "Clear";
        clearBtn.setAttribute("id", "special-buttons")

        arrowsDiv.appendChild(arrowLeftBtn);
        arrowsDiv.appendChild(arrowRightBtn);
        clearDiv.appendChild(clearBtn);
    }

    function createNumberBtns() {
        const numbersDiv = document.querySelector(".number-buttons");
        let rows = [];
        for (let n = 0; n < 4; n++) {
            const currRow = document.createElement("div");
            currRow.setAttribute("class", "rows gap");
            numbersDiv.appendChild(currRow);
            rows.unshift(currRow);
        }
        for (let m = 1; m < 10; m++) {
            let i = Math.floor((m-1) / 3) + 1;
            let row = rows[i];
            const btn = Button();
            btn.textContent = m;

            row.appendChild(btn);
        }
        const lastRow = rows[0];
        const LAST_ROW_VALS = ["0", ".", "Ans"];
        for (let p = 0; p < 3; p++) {
            const btn = Button();
            btn.textContent = LAST_ROW_VALS[p];

            lastRow.appendChild(btn);
        }

    }

    function createOperBtns () {
        const operDiv = document.querySelector(".operation-buttons");
        const OPER_ROW_VALS = ["=", "Del", "x", "/", "+", "-", "(", ")"];
        let rows = [];

        for (let n = 0; n < 4; n++) {
            const row = document.createElement("div");
            row.setAttribute("class", "rows gap");
            rows.push(row);
            operDiv.appendChild(row);
        }

        for (let m = 0; m < 8; m++) {
            const row = rows[Math.floor(m/2)];
            const btn = Button();

            if (OPER_ROW_VALS[m] == "Del") {
                btn.setAttribute("id", "special-buttons");
        
            }
            btn.textContent = OPER_ROW_VALS[m];
            row.appendChild(btn);
        }
    }

    
    createNumberBtns();
    createFunctBtns();
    createOperBtns();

}

createCalcBtns()

function clearCalcScreen() {
    calcContext.clearRect(0, 0, calcScreen.width, calcScreen.height);
    calcArr = [];
    drawX = STARTING_X_POS;
    currCharPos = -1;

}

function deleteCurrChar() {
    if (currCharPos == -1) return
    let removedVal = calcArr.splice(currCharPos, 1);
    clearTargetLine();
    drawX -= (removedVal == "Ans") ? ELEMENTS_GAP * 3 : ELEMENTS_GAP;
    draw(currCharPos);
    currCharPos--
    
}

function moveLeft() {
    clearTargetLine();
    if (currCharPos == -1) {
        drawX = prevX;
        currCharPos = calcArr.length - 1
    }
    else {
        drawX -= (calcArr[currCharPos] == "Ans") ? ELEMENTS_GAP * 3 : ELEMENTS_GAP;
        currCharPos--
    }
}

function moveRight() {
    clearTargetLine();
    if (currCharPos == calcArr.length - 1) {
        drawX = STARTING_X_POS;
        currCharPos = -1;
    }
    else {
        currCharPos++
        drawX += (calcArr[currCharPos] == "Ans") ? ELEMENTS_GAP * 3 : ELEMENTS_GAP;
    }
}

let bracketCount = 0;
let currIndex = 0;

function evalEq() {
    let res = 0;
    let float = false;
    let dotDiv = 10;
    const intArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    while (currIndex < calcArr.length) {
        if (intArr.includes(+calcArr[currIndex])) {
            if (!float) {
                res *= 10;
                res += +calcArr[currIndex];
            }
            else {
                res += +calcArr[currIndex] / dotDiv
                dotDiv *= 10;
            }
        }
        else if (calcArr[currIndex] == ".") float = true;
        else if (["+", "-"].includes(calcArr[currIndex])) {
            currIndex++
            if (currIndex > calcArr.length - 1) callSyntaxError();
            else if (calcArr[currIndex-1] == "+") res += evalEq(); 
            else res -= evalEq();
        }
        currIndex++
    }
    return res
} 

function callSyntaxError() {
    console.log("Syntax error")
}

function callMathError() {
    console.log("Math error")
}


function Button() {
    let obj = document.createElement("button");
    obj.addEventListener("mousedown", (e) => {
        this.lightColor = getComputedStyle(e.target).backgroundColor;
        let dimColor = getRgbFromString(this.lightColor);
        const DIM_PERCENTAGE = 0.75;

        e.target.style.backgroundColor = `rgb(${dimColor[0] * DIM_PERCENTAGE}, ${dimColor[1] * DIM_PERCENTAGE}, ${dimColor[2] * DIM_PERCENTAGE})`;
    })

    obj.addEventListener("click", (e) => {
        e.target.style.backgroundColor = this.lightColor;
        let pressedValue = e.target.textContent;

        if (pressedValue == "Clear") clearCalcScreen();
        else if (pressedValue == "Del") deleteCurrChar();
        else if (pressedValue == "<") moveLeft();
        else if (pressedValue == ">") moveRight();
        else if (pressedValue == "=") draw(evalEq());
        else {
            calcArr.splice(currCharPos + 1, 0, pressedValue);
            currCharPos++
            draw(currCharPos);
            drawX += (calcArr[currCharPos] == "Ans") ? ELEMENTS_GAP * 3: ELEMENTS_GAP;
        }

    })

    function getRgbFromString(string) {
        return string.split("").slice(4, -1).join("").split(", ");
    }

    return obj
}

function draw(index) {
    calcContext.font = TEXT_FONT;
    calcContext.clearRect(drawX, DRAW_EQU_Y + 10, SCREEN_WIDTH_NUMBER, -52);
    let tmpX = drawX;
    for (let n = index; n < calcArr.length; n++) {
        //two loops are needed for drawing ans in 3 separate places
        for (let m of calcArr[n]) {
            let addLeftMargin = (m == '.') ? Math.floor(calcContext.measureText(".").width / 2) : 0;
            calcContext.fillText(m, tmpX + addLeftMargin, DRAW_EQU_Y, ELEMENTS_GAP - 4);
            tmpX += ELEMENTS_GAP;
        }
    }
    prevX = tmpX;
    
    clearTargetLine()
    
}

function drawResult(res) {
    calcContext.font = TEXT_FONT;
    calcContext.fillText(res, 0, RESULT_Y_POS)
}

function drawTargetLine() {
    calcContext.fillRect(drawX - 4, DRAW_EQU_Y, 4, -26);
    window.setTimeout(() => {
        clearTargetLine();
        window.setTimeout(() => {drawTargetLine()}, TARGET_LINE_INTERVAL * 1000);
    }, TARGET_LINE_INTERVAL * 1000)
    
}

function clearTargetLine() {
    calcContext.clearRect(drawX - 4, DRAW_EQU_Y, 4, -26);
    
}

drawTargetLine()