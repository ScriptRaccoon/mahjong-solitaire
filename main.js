import { images } from "./images.js";
import { createTiles } from "./createTiles.js";
import { shuffle, remove, tileAt, tileFrontAt, alert } from "./helper.js";
import { isOpen, COORDINATES } from "./coordinates.js";

let selectedCoord = null;
let currentCoords = [...COORDINATES];
let hintCoord = null;

shuffle(images);
createTiles(click);
checkMovePossible();

function click(coord) {
    if (!isOpen(coord, currentCoords)) return;
    if (selectedCoord) {
        if (coord.toString() === selectedCoord.toString()) {
            unselect(coord);
            return;
        } else {
            const tile = tileAt(coord);
            const selectedTile = tileAt(selectedCoord);
            if (tile.getAttribute("type") === selectedTile.getAttribute("type")) {
                tile.style.display = "none";
                selectedTile.style.display = "none";
                remove(coord, currentCoords);
                remove(selectedCoord, currentCoords);
                finishMove();
                return;
            }
        }
    }
    select(coord);
}

function finishMove() {
    selectedCoord = null;
    if (currentCoords.length === 0) {
        alert("You won!");
    } else {
        checkMovePossible();
    }
}

function select(coord) {
    unselect(selectedCoord);
    selectedCoord = coord;
    tileFrontAt(coord).classList.add("selectedTile");
}

function unselect(coord) {
    if (!coord) return;
    tileFrontAt(coord).classList.remove("selectedTile");
    selectedCoord = null;
}

function checkMovePossible() {
    for (const p of currentCoords) {
        for (const q of currentCoords) {
            if (
                p.toString() != q.toString() &&
                isOpen(p, currentCoords) &&
                isOpen(q, currentCoords) &&
                tileAt(p).getAttribute("type") === tileAt(q).getAttribute("type")
            ) {
                hintCoord = p;
                alert("There is a move available.");
                return;
            }
        }
    }
    alert("Oh no! There are no moves left.");
    hintCoord = null;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        restartGame();
        checkMovePossible();
    } else if (e.key === "h" && hintCoord) {
        select(hintCoord);
    }
});

function restartGame() {
    selectedCoord = null;
    hintCoord = null;
    currentCoords = [...COORDINATES];
    shuffle(images);
    for (let counter = 0; counter < COORDINATES.length; counter++) {
        const coord = COORDINATES[counter];
        const image = images[counter];
        const tile = tileAt(coord);
        tile.style.display = "block";
        tile.setAttribute("type", image.getAttribute("type"));
        const tileFront = tile.querySelector(".tileFront");
        tileFront.classList.remove("selectedTile");
        tileFront.innerHTML = "";
        tileFront.appendChild(image);
    }
}
