function createCalcBtns() {
    function createFunctBtns() {
        const arrowsDiv = document.querySelector("#left-right-buttons");
        const onOffDiv = document.querySelector("#on-of-button");
        const arrowLeftBtn = document.createElement("button");
        const arrowRightBtn = document.createElement("button");
        const onOffBtn = document.createElement("button")

        arrowLeftBtn.textContent = "<";
        arrowRightBtn.textContent = ">";
        onOffBtn.textContent = "On/Off";

        arrowsDiv.appendChild(arrowLeftBtn);
        arrowsDiv.appendChild(arrowRightBtn);
        onOffDiv.appendChild(onOffBtn);
    }

    function createNumberBtns() {
        const numbersDiv = document.querySelector(".number-buttons")
        let rows = [];
        for (let n = 0; n < 4; n++) {
            const currRow = document.createElement("div")
            currRow.setAttribute("class", "rows gap")
            numbersDiv.appendChild(currRow)
            rows.unshift(currRow)
        }
        for (let m = 1; m < 10; m++) {
            let i = Math.floor((m-1) / 3) + 1
            let row = rows[i]
            const btn = document.createElement("button")
            btn.textContent = m
            console.log(m)

            row.appendChild(btn)
        }
        const lastRow = rows[0];
        const LAST_ROW_VALS = ["0", ".", "Ans"];
        for (let p = 0; p < 3; p++) {
            const btn = document.createElement("button")
            btn.textContent = LAST_ROW_VALS[p]

            lastRow.appendChild(btn)
        }

        console.log(rows)
    }

    function createOperBtns () {
        const operDiv = document.querySelector(".operation-buttons")
        let rows = [];

        for (let n = 0; n < 4; n++) {
            const row = document.createElement("div")
            row.setAttribute("class", "rows gap")
            rows.push(row)
            operDiv.appendChild(row)
        }
    }

    
    createNumberBtns()
    createFunctBtns()
    createOperBtns()
}

createCalcBtns()