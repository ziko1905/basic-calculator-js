function createCalcBtns() {
    function createFunctBtns() {
        const arrowsDiv = document.querySelector("#left-right-buttons");
        const onOffDiv = document.querySelector("#on-of-button");
        const arrowLeftBtn = document.createElement("button");
        const arrowRightBtn = document.createElement("button");

        arrowLeftBtn.textContent = "<"
        arrowRightBtn.textContent = ">"

        arrowsDiv.appendChild(arrowLeftBtn);
        arrowsDiv.appendChild(arrowRightBtn);
    }

    createFunctBtns()
}

createCalcBtns()