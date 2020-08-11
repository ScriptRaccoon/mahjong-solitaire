import { COORDINATES, isOpen } from "./COORDINATES.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";
import { shuffle, remove } from "./helper.js";

const TILE_OFFSET = 7;
const TOTAL_OFFSET_TOP = 30;
const TOTAL_OFFSET_LEFT = 80;

let selectedCoord = null;
let hintCoord = null;
let currentCoords = [...COORDINATES];

createTiles();

function createTiles() {
    shuffle(images);
    let counter = 0;
    const game = document.getElementById("game");
    for (const coord of COORDINATES) {
        const [x, y, z] = coord;

        const image = images[counter];
        counter++;

        const tileFront = document.createElement("div");
        tileFront.classList.add("tileFront");
        tileFront.style.width = `${TILE_WIDTH}px`;
        tileFront.style.height = `${TILE_HEIGHT}px`;
        tileFront.addEventListener("click", () => {
            click(coord);
        });
        tileFront.appendChild(image);

        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.style.left = `${x * TILE_WIDTH + TILE_OFFSET * z + TOTAL_OFFSET_LEFT}px`;
        tile.style.top = `${y * TILE_HEIGHT + TILE_OFFSET * z + TOTAL_OFFSET_TOP}px`;
        tile.style["z-index"] = z;
        tile.id = coord.toString();
        tile.setAttribute("type", image.id);

        const tileBack = document.createElement("div");
        tileBack.classList.add("tileBack");
        tileBack.style.width = `${TILE_WIDTH - 0.5 * TILE_OFFSET}px`;
        tileBack.style.height = `${TILE_HEIGHT - 0.5 * TILE_OFFSET}px`;
        tileBack.style.left = `${-TILE_OFFSET}px`;
        tileBack.style.top = `${-TILE_OFFSET}px`;

        const leftEdge = document.createElement("div");
        leftEdge.classList.add("leftEdge");
        leftEdge.style.left = `${-TILE_OFFSET}px`;
        leftEdge.style.top = `${TILE_HEIGHT - 1.5 * TILE_OFFSET}px`;

        const rightEdge = document.createElement("div");
        rightEdge.classList.add("rightEdge");
        rightEdge.style.left = `${TILE_WIDTH - 1.5 * TILE_OFFSET}px`;
        rightEdge.style.top = `${-TILE_OFFSET}px`;

        tile.appendChild(leftEdge);
        tile.appendChild(rightEdge);
        tile.appendChild(tileBack);
        tile.appendChild(tileFront);

        game.appendChild(tile);
    }

    checkMovePossible();
}

function alert(txt) {
    document.getElementById("alert").innerText = txt;
}

function tileAt(coord) {
    return document.getElementById(coord.toString());
}

function tileFrontAt(coord) {
    return document.getElementById(coord.toString()).querySelector(".tileFront");
}

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
                afterMove();
                return;
            }
        }
    }
    select(coord);
}

function afterMove() {
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

function restartGame() {
    selectedCoord = null;
    hintCoord = null;
    currentCoords = [...COORDINATES];
    shuffle(images);
    let counter = 0;
    for (const coord of COORDINATES) {
        const image = images[counter];
        const tile = tileAt(coord);
        tile.style.display = "block";
        tile.setAttribute("type", image.id);
        const tileFront = tile.querySelector(".tileFront");
        tileFront.classList.remove("selectedTile");
        tileFront.innerHTML = "";
        tileFront.appendChild(image);
        counter++;
    }
    checkMovePossible();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        restartGame();
    } else if (e.key === "h" && hintCoord) {
        select(hintCoord);
    }
});
