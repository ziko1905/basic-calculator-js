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

    createFunctBtns()
}

createCalcBtns()