import { COORDINATES, leftNeighbors, rightNeighbors } from "./COORDINATES.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";
import { shuffle, disjoint, remove } from "./helper.js";

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
    for (const coord of COORDINATES) {
        const [x, y, z] = coord;

        const image = images[counter];
        counter++;

        const tileFront = $("<div></div")
            .addClass("tileFront")
            .css("width", TILE_WIDTH)
            .css("height", TILE_HEIGHT)
            .on("click", () => {
                click(coord);
            })
            .append(image);

        const tile = $("<div></div>")
            .addClass("tile")
            .css("left", x * TILE_WIDTH + TILE_OFFSET * z + TOTAL_OFFSET_LEFT)
            .css("top", y * TILE_HEIGHT + TILE_OFFSET * z + TOTAL_OFFSET_TOP)
            .css("z-index", z)
            .attr("id", coord.toString())
            .attr("type", image.id);

        const tileBack = $("<div></div>")
            .addClass("tileBack")
            .css("width", TILE_WIDTH - 0.5 * TILE_OFFSET)
            .css("height", TILE_HEIGHT - 0.5 * TILE_OFFSET)
            .css("left", -TILE_OFFSET)
            .css("top", -TILE_OFFSET);

        const leftEdge = $("<div></div>")
            .addClass("leftEdge")
            .css("left", -TILE_OFFSET)
            .css("top", TILE_HEIGHT - 1.5 * TILE_OFFSET);

        const rightEdge = $("<div></div>")
            .addClass("rightEdge")
            .css("left", TILE_WIDTH - 1.5 * TILE_OFFSET)
            .css("top", -TILE_OFFSET);

        tile.append(leftEdge).append(rightEdge).append(tileBack).append(tileFront);

        $("#game").append(tile);
    }

    checkMovePossible();
}

// todo: jQueryisieren

function click(coord) {
    if (!isOpen(coord) || disjoint([coord], currentCoords)) return;
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

function alert(txt) {
    $("#alert").text(txt);
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
    const tile = tileAt(coord);
    unselect(selectedCoord);
    selectedCoord = coord;
    tile.querySelector(".tileFront").classList.add("selectedTile");
}

function unselect(coord) {
    if (!coord) return;
    const tile = tileAt(coord);
    selectedCoord = null;
    tile.querySelector(".tileFront").classList.remove("selectedTile");
}

function tileAt(coord) {
    return document.getElementById(coord.toString());
}

function checkMovePossible() {
    for (const p of currentCoords) {
        for (const q of currentCoords) {
            if (
                p.toString() != q.toString() &&
                isOpen(p) &&
                isOpen(q) &&
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

function isOpen(coord) {
    const [x, y, z] = coord;
    if (
        currentCoords.some(([a, b, c]) => a === x && b === y && c > z) ||
        (z === 3 && currentCoords.some(([a, b, c]) => c === 4))
    ) {
        return false;
    }
    if (
        disjoint(leftNeighbors(coord), currentCoords) ||
        disjoint(rightNeighbors(coord), currentCoords)
    ) {
        return true;
    }
    return false;
}

$(document).on("keydown", (e) => {
    if (e.key === "Enter") {
        restartGame();
    } else if (e.key === "h" && hintCoord) {
        select(hintCoord);
    }
});

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
