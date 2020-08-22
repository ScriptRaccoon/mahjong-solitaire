const infoButton = document.getElementById("infoButton");
const infoText = document.getElementById("infoText");
const game = document.getElementById("game");
const footer = document.querySelector("footer");

let infoTextOpen = false;

infoButton.addEventListener("click", () => {
    if (infoTextOpen) {
        infoTextOpen = false;
        infoButton.classList.remove("infoButtonClicked");
        infoText.style.display = "none";
        game.style.display = "block";
        footer.style.display = "flex";
    } else {
        infoTextOpen = true;
        infoButton.classList.add("infoButtonClicked");
        game.style.display = "none";
        footer.style.display = "none";
        infoText.style.display = "block";
    }
});
