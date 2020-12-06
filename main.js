import { images } from "./images.js";
import { createTiles } from "./createTiles.js";
import {
    shuffle,
    remove,
    tileAt,
    tileFrontAt,
    writeStatus,
    randEl,
    sleep,
} from "./utils.js";
import { isOpen, COORDINATES } from "./coordinates.js";
import {} from "./infoText.js";

let selectedCoord = null;
let currentCoords = [...COORDINATES];
let hintCoord = null;

$(document).ready(initGame);

async function initGame() {
    shuffle(images);
    createTiles({ clickFunction: clickTileAt });
    await checkMovePossible("Game is loading...");
    $("#game").animate({ opacity: 1 }, "slow");
}

function clickTileAt(coord) {
    if (!isOpen(coord, currentCoords)) return;
    if (selectedCoord) {
        if (coord.toString() === selectedCoord.toString()) {
            unselectTileAt(coord);
            return;
        } else {
            const tile = tileAt(coord);
            const selectedTile = tileAt(selectedCoord);
            if (tile.attr("type") === selectedTile.attr("type")) {
                executeMove(tile, selectedTile, coord, selectedCoord);
                return;
            }
        }
    }
    selectTileAt(coord);
}

function executeMove(tile, selectedTile, coord, selectedCoord) {
    selectedTile.animate({ opacity: 0 }, "fast");
    tile.animate({ opacity: 0 }, "fast", () => {
        selectedTile.hide();
        tile.hide();
        remove(coord, currentCoords);
        remove(selectedCoord, currentCoords);
        selectedCoord = null;
        hintCoord = null;
        if (currentCoords.length === 0) {
            writeStatus("You won!");
        } else {
            checkMovePossible("Computing...");
        }
    });
}

function selectTileAt(coord) {
    if (!coord) return;
    unselectTileAt(selectedCoord);
    selectedCoord = coord;
    tileFrontAt(coord).addClass("selectedTile");
}

function unselectTileAt(coord) {
    if (!coord) return;
    tileFrontAt(coord).removeClass("selectedTile");
    selectedCoord = null;
}

async function checkMovePossible(message) {
    writeStatus(message);
    await sleep(50);
    const moves = [];
    for (let i = 0; i < currentCoords.length; i++) {
        for (let j = i + 1; j < currentCoords.length; j++) {
            const p = currentCoords[i];
            const q = currentCoords[j];
            if (
                p.toString() !== q.toString() &&
                tileAt(p).attr("type") === tileAt(q).attr("type") &&
                isOpen(p, currentCoords) &&
                isOpen(q, currentCoords)
            ) {
                moves.push([p, q]);
            }
        }
    }
    updateStatus(moves);
    if (moves.length > 0) hintCoord = randEl(randEl(moves));
}

function updateStatus(moves) {
    if (moves.length == 0) {
        writeStatus("You lost the game. There are no moves left.");
    } else if (moves.length === 1) {
        writeStatus("There is exactly one possible move.");
    } else {
        writeStatus("There are " + moves.length + " possible moves.");
    }
}

$("#restartButton").click(async () => {
    $("#game").animate({ opacity: 0 }, "fast");
    await sleep(200);
    restartGame();
    await checkMovePossible("Game is restarting...");
    $("#game").animate({ opacity: 1 }, "fast");
});

$("#hintButton").click(() => {
    if (!hintCoord) return;
    selectTileAt(hintCoord);
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            tileFrontAt(hintCoord).toggleClass("selectedTile");
        }, 200 * i);
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
        tileAt(coord).show().css("opacity", 1).attr("type", image.attr("type"));
        tileFrontAt(coord).removeClass("selectedTile").html("").append(image);
    }
}
