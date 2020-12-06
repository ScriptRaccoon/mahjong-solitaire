const infoButton = document.getElementById("infoButton");
const infoText = document.getElementById("infoText");
const game = document.getElementById("game");
const statusText = document.getElementById("statusText");

export let infoTextOpen = false;

infoButton.addEventListener("click", () => {
    if (infoTextOpen) {
        infoTextOpen = false;
        infoText.style.display = "none";
        statusText.style.display = "inline";
        hintButton.style.display = "inline";
        restartButton.style.display = "inline";
        game.style.opacity = 1;
    } else {
        infoTextOpen = true;
        infoText.style.display = "block";
        game.style.opacity = 0.01;
        hintButton.style.display = "none";
        restartButton.style.display = "none";
        statusText.style.display = "none";
    }
});
