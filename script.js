import Canvas2Image from "./resources/canvas2image.js";

//function to render the final result from what is pasted in the input
function render() {
    const input = document.getElementById("input");
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    //loading the css styles to faithfully render result in canvas
    const styles = getComputedStyle(document.documentElement);
    const fontFamily = styles.getPropertyValue("--font-family").trim();
    const fontSize = parseFloat(styles.getPropertyValue("--font-size"));
    const padding = parseFloat(styles.getPropertyValue("--canvas-padding"));
    const bgColor = styles.getPropertyValue("--result-bg-color").trim();
    const textColor = styles.getPropertyValue("--result-text-color").trim();
    ctx.font = `${fontSize}px ${fontFamily}`;

    //if empty show the default art, otherwise show what the user pasted
    const text = input.value.trim() === ""
        ? defaultArt
        : input.value;

    const lines = text.split("\n");

    //calculations to ensure the canvas is the right size given the ascii art
    ctx.font = `${fontSize}px ${fontFamily}`;
    //for the width we choose whatever is larger, the line with the most characters, or 1
    const maxWidth = Math.max(
        ...lines.map(line => ctx.measureText(line).width),
        1
    );
    //we add the padding at either side
    canvas.width = Math.ceil(maxWidth + padding * 2);
    //for the height we choose the number of lines, adding the padding at the top and bottom
    canvas.height = Math.ceil(
        lines.length * fontSize * 1.2 +
        padding * 2
    );

    //style rendering
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
        ctx.fillText(
            line,
            padding,
            padding + i * fontSize * 1.2
        );
    });
}

//function to load the default art
let defaultArt = "";
async function loadDefaultArt() {
    try {
        const response = await fetch("./resources/defaultart.txt");
        if (!response.ok) {
            throw new Error("Couldn't load default art.");
        }
        defaultArt = await response.text();
    } catch (err) {
        console.error(err);
    }
}

//function to change the background color of the end result
function changeBackground() {
    const picker = document.getElementById("bg-color");
    const color = picker.value;
    document.documentElement.style.setProperty("--result-bg-color", color);
    render();
}

//function to change the text color of the end result
function changeText() {
    const picker = document.getElementById("text-color");
    const color = picker.value;
    document.documentElement.style.setProperty("--result-text-color", color);
    render();
}

//function to change the margins of the end result
function changeMargins() {
    const slider = document.getElementById("margins");
    const margins = slider.value;
    document.documentElement.style.setProperty("--canvas-padding", margins);
    console.log(document.documentElement.style.getPropertyValue("--canvas-padding"));
    render();
}

//function to save the art as an image
function saveArt() {
    const canvas = document.getElementById("preview");
    Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height, "ascii-art");
}

//funtion to clear the input box
function clearInput() {
    const input = document.getElementById("input");
    input.value = '';
    render();
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const saveButton = document.getElementById("saveArt");
    const pickerOne = document.getElementById("bg-color");
    const pickerTwo = document.getElementById("text-color");
    const slider = document.getElementById("margins");
    const clearButton = document.getElementById("clearInput");


    //create the event listeners and render one first time
    input.addEventListener("input", render);
    saveButton.addEventListener("click", saveArt);
    pickerOne.addEventListener("input", changeBackground);
    pickerTwo.addEventListener("input", changeText);
    slider.addEventListener("input", changeMargins);
    clearButton.addEventListener("click", clearInput);

    loadDefaultArt().then(render);
});