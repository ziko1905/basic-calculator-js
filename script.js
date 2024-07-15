let calcArr = [];
let prevAns = 0;
const calcScreen = document.querySelector("canvas");
const calcContext = calcScreen.getContext("2d")
const SCREEN_WIDTH = getComputedStyle(calcScreen).width;
const SCREEN_HEIGHT = getComputedStyle(calcScreen).height;
const SCREEN_WIDTH_NUMBER = +SCREEN_WIDTH.split("").slice(0, -2).join("")
const SCREEN_HEIGHT_NUMBER = +SCREEN_HEIGHT.split("").slice(0, -2).join("")
const STARTING_X_POS = 9;

let currCharPos = -1;
let drawX = STARTING_X_POS;
const DRAW_EQU_Y = 50
const TARGET_LINE_INTERVAL = 0.5; //interval in seconds


calcScreen.setAttribute("width", SCREEN_WIDTH);
calcScreen.setAttribute("height", SCREEN_HEIGHT)

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

    
    createNumberBtns()
    createFunctBtns()
    createOperBtns()
}

createCalcBtns()

function clearCalcScreen() {
    calcContext.clearRect(0, 0, calcScreen.width, calcScreen.height)
    calcArr = []
    drawX = STARTING_X_POS;
    console.log("screen cleared")

}

function deleteCurrChar() {
    if (currCharPos == -1) return
    calcArr.splice(currCharPos, 1)
    clearTargetLine()
    drawX -= 28;
    draw(currCharPos)
    currCharPos--
    
}

function moveLeft() {
    if (currCharPos == -1) return
    currCharPos--
    clearTargetLine()
    drawX -= 28
}

function moveRight() {
    if (currCharPos == calcArr.length - 1) return
    currCharPos++
    clearTargetLine()
    drawX += 28
}

function Button(func) {
    let obj = document.createElement("button");
    obj.addEventListener("mousedown", (e) => {
        this.lightColor = getComputedStyle(e.target).backgroundColor;
        let dimColor = getRgbFromString(this.lightColor)
        const DIM_PERCENTAGE = 0.75;

        e.target.style.backgroundColor = `rgb(${dimColor[0] * DIM_PERCENTAGE}, ${dimColor[1] * DIM_PERCENTAGE}, ${dimColor[2] * DIM_PERCENTAGE})`
    })

    obj.addEventListener("click", (e) => {
        e.target.style.backgroundColor = this.lightColor;
        let pressedValue = e.target.textContent;

        if (pressedValue == "Clear") clearCalcScreen()
        else if (pressedValue == "Del") deleteCurrChar()
        else if (pressedValue == "<") moveLeft()
        else if (pressedValue == ">") moveRight()
        else {
            calcArr.splice(currCharPos + 1, 0, pressedValue)
            currCharPos++
            draw(currCharPos)
            drawX += 28;
        }

    })

    function getRgbFromString(string) {
        return string.split("").slice(4, -1).join("").split(", ")
    }

    return obj
}

function addToExpression(string) {
    calcArr.push(string)
}
console.log(SCREEN_WIDTH_NUMBER)

function draw(index) {
    calcContext.font = "48px serif"
    calcContext.clearRect(drawX, DRAW_EQU_Y + 10, SCREEN_WIDTH_NUMBER, -52)
    let tmpX = drawX
    for (let n = index; n < calcArr.length; n++) {
        calcContext.fillText(calcArr[n], tmpX, DRAW_EQU_Y, 24);
        tmpX += 28;
    }
    
    clearTargetLine()
    
}

function drawTargetLine() {
    calcContext.fillRect(drawX - 4, DRAW_EQU_Y, 4, -32);
    window.setTimeout(() => {
        clearTargetLine()
        window.setTimeout(() => {drawTargetLine()}, TARGET_LINE_INTERVAL * 1000)
    }, TARGET_LINE_INTERVAL * 1000)
    
    
}

function clearTargetLine() {
    calcContext.clearRect(drawX - 4, DRAW_EQU_Y, 4, -32);
    
}

drawTargetLine()