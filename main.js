import { images } from "./images.js";
import { createTiles } from "./createTiles.js";
import { shuffle, remove, tileAt, tileFrontAt, alert, randEl } from "./helper.js";
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
                executeMove(tile, selectedTile, coord, selectedCoord);
                return;
            }
        }
    }
    select(coord);
}

function executeMove(tile, selectedTile, coord, selectedCoord) {
    tile.style.display = "none";
    selectedTile.style.display = "none";
    remove(coord, currentCoords);
    remove(selectedCoord, currentCoords);
    selectedCoord = null;
    hintCoord = null;
    if (currentCoords.length === 0) {
        alert("You won!");
    } else {
        alert("Computing...");
        setTimeout(() => {
            checkMovePossible();
        }, 100);
    }
}

function select(coord) {
    if (!coord) return;
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
    let moves = [];
    for (let i = 0; i < currentCoords.length; i++) {
        for (let j = i + 1; j < currentCoords.length; j++) {
            const p = currentCoords[i];
            const q = currentCoords[j];
            if (
                p.toString() !== q.toString() &&
                isOpen(p, currentCoords) &&
                isOpen(q, currentCoords) &&
                tileAt(p).getAttribute("type") === tileAt(q).getAttribute("type")
            ) {
                moves.push([p, q]);
            }
        }
    }
    if (moves.length == 0) {
        alert("You lost the game. There are no moves left.");
        return;
    } else if (moves.length === 1) {
        alert("There is one possible move.");
    } else {
        alert("There are " + moves.length + " possible moves.");
    }
    hintCoord = randEl(randEl(moves));
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
