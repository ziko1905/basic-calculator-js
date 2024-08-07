let calcArr = [];
let equCalcArr = [];
let prevAns = 0;
let currCharPos = -1;

const calcScreen = document.querySelector("canvas");
const calcContext = calcScreen.getContext("2d")
const TEXT_SIZE = "38px"
const TEXT_FONT = "serif"
const TEXT_STYLE = `${TEXT_SIZE} ${TEXT_FONT}`;
calcContext.font = TEXT_STYLE;

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
let targetLineTimeout;
let drawTargetTimeout;
let ans = 1;
let error = false;


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
    calcContext.clearRect(0, 0, SCREEN_WIDTH_NUMBER, SCREEN_HEIGHT_NUMBER);
    calcArr = [];
    drawX = STARTING_X_POS;
    currCharPos = -1;
    clearTargetLine()
    drawTargetLine()

}

function clearResultScreen() {
    calcContext.clearRect(0, RESULT_Y_POS - 50, SCREEN_WIDTH_NUMBER, SCREEN_HEIGHT_NUMBER)
}

function deleteCurrChar() {
    if (currCharPos == -1) return
    let removedVal = calcArr.splice(currCharPos, 1);
    clearTargetLine();
    drawX -= (removedVal == "Ans") ? ELEMENTS_GAP * 3 : ELEMENTS_GAP;
    draw(currCharPos);
    drawTargetLine();
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
    drawTargetLine()
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
    drawTargetLine()
}

function drawResult(res) {
    calcContext.font = `48px ${TEXT_FONT}`;
    let textWidth = calcContext.measureText(res).width;
    calcContext.fillText(res, SCREEN_WIDTH_NUMBER - textWidth - 10, RESULT_Y_POS)
}

function drawTargetLine() {
    calcContext.fillRect(drawX - 4, DRAW_EQU_Y, 4, -26);
    targetLineTimeout = window.setTimeout(() => {
        calcContext.clearRect(drawX - 4, DRAW_EQU_Y, 4, -26);;
        drawTargetTimeout = window.setTimeout(() => {drawTargetLine()}, TARGET_LINE_INTERVAL * 1000);
    }, TARGET_LINE_INTERVAL * 1000)
    
}

function clearTargetLine() {
    calcContext.clearRect(drawX - 4, DRAW_EQU_Y, 4, -26);
    window.clearTimeout(targetLineTimeout);
    window.clearTimeout(drawTargetTimeout);

}

drawTargetLine()

class EvalEqu {
    static firstLvlOper = ["+", "-"];
    static secondLvlOper = ["x", '/'];
    static opers = [...this.firstLvlOper, ...this.secondLvlOper]

    constructor(arr) {
        this.equ = [...arr];
        this.addMultiplicationSign()
        if (this.checkSyntaxErrors()) {
            this.equ = "Syntax Error"
            return
        }
        let brackets = this.evalBrackets();
        while (brackets) {
            if (typeof brackets == "string") {
                this.equ = brackets;
                return
            }
            else brackets = this.evalBrackets();
        }
        this.replaceAns()
        this.convertToNumbers()
        let divError = this.secondLvlEval()
        if (divError) {
            this.equ = divError
            return
        }
        this.firstLvlOper()
    }

    addMultiplicationSign = () => {
        const needAdding = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "Ans"];
        let n = 0;
        while (n < this.equ.length - 1) {
            if (["(", "Ans"].includes(this.equ[n+1]) && [...needAdding, ")"].includes(this.equ[n])) {
                this.equ.splice(n+1, 0, "x")
            }
            n++

        }
    }

    checkSyntaxErrors = () => {
        let dot = false;
        let raise = false;
        let number = false;
        let bracketCount = 0;
        for (let n = 0; n < this.equ.length; n++) {
            if (EvalEqu.opers.includes(this.equ[n])) {
                if ((n == this.equ.length - 1) ||
                (n == 0 && EvalEqu.secondLvlOper.includes(this.equ[n])) ||
                (n > 0 && EvalEqu.opers.includes(this.equ[n-1]) && EvalEqu.secondLvlOper.includes(this.equ[n]))) return true
                dot = false;
                raise = false;
                number = false;
            }
            else if (this.equ[n] == ".") {
                if (dot) return true
                dot = true;
            }
            else if ("Ans" == this.equ[n]) {
                if (dot || number || raise) return true
                raise = true;
            }
            else if ("(" == this.equ[n]) bracketCount++;
            else if (")" == this.equ[n]) {
                if (!bracketCount || ("(" == this.equ[n-1])) return true
                raise = true;
                bracketCount--
            }
            else {
                if (raise) return true
                number = true;
            }
        }
        return bracketCount ? true : false
    }

    evalBrackets = () => {
        let replacement;
        let f = null;
        let s = null;
        let prevBracketCount = 0;
        for (let n = 0; n < this.equ.length; n++) {
            if (this.equ[n] == "(") {
                if (f === null) f = n;
                else prevBracketCount++
            }
            else if ((this.equ[n] == ")")) {
                if (prevBracketCount) prevBracketCount--;
                else {
                    s = n;
                    break
                }
            }
        }
        if (f !== null) {
            replacement = new EvalEqu(this.equ.slice(f + 1, s)).equ
            if (typeof replacement == "string") return replacement
            this.equ.splice(f, s - f + 1, replacement)
            return true
        }
        return false
    }

    replaceAns = () => {
        for (let n = 0; n < this.equ.length; n++) {
            if (this.equ[n] == "Ans") this.equ[n] = ans;
        }
    }

    convertToNumbers = () => {
        let newArr = [];
        let currNum = null;
        let multiplayer = 1;
        let dot = false;
        let dotDiv = 10;
        for (let n = 0; n < this.equ.length; n++) {
            if (this.equ[n] == ".") {
                dot = true;
                currNum = +currNum;
            }
            else if (currNum == null) {
                switch (this.equ[n]) {
                    case "+":
                        continue
                    case "-":
                        multiplayer *= -1;
                        break
                    default:
                        currNum = +this.equ[n];
                }
            }
            else if (EvalEqu.opers.includes(this.equ[n]) || typeof this.equ[n] == "number") {
                newArr.push(multiplayer * currNum)
                if (EvalEqu.secondLvlOper.includes(this.equ[n]) || typeof this.equ[n] == "number") newArr.push(this.equ[n])
                currNum = null;
                dot = false;
                dotDiv = 10;
                multiplayer = this.equ[n] == "-" ? -1 : 1;
            }
            else {
                let add = +this.equ[n];
                if (!dot) currNum *= 10;
                else {
                    add /= dotDiv;
                    dotDiv *= 10
                }
                currNum += add
            }
        }
        newArr.push(currNum * multiplayer)
    this.equ = newArr;
    }

    secondLvlEval = () => {
        let i = 0;
        while (i < this.equ.length) {
            if (EvalEqu.secondLvlOper.includes(this.equ[i])) {
                if (this.equ[i] == "x") {
                    this.equ.splice(i - 1, 3, this.equ[i-1] * this.equ[i+1]);
                }
                else {
                    if (this.equ[i+1] === 0) return "Math error"
                    this.equ.splice(i - 1, 3, this.equ[i-1] / this.equ[i+1]);
                }
            }
            else i++
        }
        return false
    }

    firstLvlOper = () => {
        let res = 0;
        while (this.equ.length > 0) {
            res += this.equ.pop();
        }
        this.equ = res;
    }

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
        clearResultScreen()

        if (error) {
            drawX = STARTING_X_POS;
            draw(0);
            drawX = prevX;
            error = false;
            drawTargetLine()
        }

        if (pressedValue == "Clear") clearCalcScreen();
        else if (pressedValue == "Del") deleteCurrChar();
        else if (pressedValue == "<") moveLeft();
        else if (pressedValue == ">") moveRight();
        else if (pressedValue == "=") {
            equ = new EvalEqu(calcArr)
            drawResult(equ.equ);
            ans = equ.equ;
        }
        else {
            calcArr.splice(currCharPos + 1, 0, pressedValue);
            currCharPos++
            draw(currCharPos);
            drawX += (calcArr[currCharPos] == "Ans") ? ELEMENTS_GAP * 3: ELEMENTS_GAP;
            drawTargetLine()
        }

    })

    function getRgbFromString(string) {
        return string.split("").slice(4, -1).join("").split(", ");
    }

    return obj
}

function draw(index) {
    calcContext.font = TEXT_STYLE;
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

