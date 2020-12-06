const infoButton = document.getElementById("infoButton");
const infoText = document.getElementById("infoText");
const game = document.getElementById("game");
const footer = document.querySelector("footer");

export let infoTextOpen = false;

infoButton.addEventListener("click", () => {
    if (infoTextOpen) {
        infoTextOpen = false;
        infoButton.classList.remove("infoButtonClicked");
        infoText.style.display = "none";
        game.style.opacity = 1;
        footer.style.opacity = 1;
    } else {
        infoTextOpen = true;
        infoButton.classList.add("infoButtonClicked");
        game.style.opacity = 0.02;
        footer.style.opacity = 0.02;
        infoText.style.display = "block";
    }
});
