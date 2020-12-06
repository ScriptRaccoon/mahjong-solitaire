import { COORDINATES } from "./coordinates.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";

const TILE_OFFSET = 7;
const TOTAL_OFFSET_TOP = 30;
const TOTAL_OFFSET_LEFT = 80;
const TILE_ROUNDNESS = 7;

export function createTiles(options) {
    const game = document.getElementById("game");
    for (let counter = 0; counter < COORDINATES.length; counter++) {
        const coord = COORDINATES[counter];
        const [x, y, z] = coord;
        const image = images[counter];

        const tileFront = document.createElement("div");
        tileFront.classList.add("tileFront");
        tileFront.style.width = TILE_WIDTH + "px";
        tileFront.style.height = TILE_HEIGHT + "px";
        tileFront.style.borderRadius = TILE_ROUNDNESS + "px";
        tileFront.addEventListener("click", () => {
            options.callback(coord);
        });
        tileFront.appendChild(image);
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.style.left = x * TILE_WIDTH + TILE_OFFSET * z + TOTAL_OFFSET_LEFT + "px";
        tile.style.top = y * TILE_HEIGHT + TILE_OFFSET * z + TOTAL_OFFSET_TOP + "px";
        tile.style["z-index"] = z;
        tile.id = coord.toString();
        tile.setAttribute("type", image.getAttribute("type"));

        const tileBack = document.createElement("div");
        tileBack.classList.add("tileBack");
        tileBack.style.width = TILE_WIDTH + TILE_OFFSET + "px";
        tileBack.style.height = TILE_HEIGHT + TILE_OFFSET + "px";
        tileBack.style.top = -TILE_OFFSET + "px";
        tileBack.style.left = -TILE_OFFSET + "px";
        tileBack.style.borderRadius = `
            ${TILE_ROUNDNESS}px
            ${2 * TILE_OFFSET}px
            ${TILE_ROUNDNESS}px
            ${2 * TILE_OFFSET}px`;

        tile.appendChild(tileBack);
        tile.appendChild(tileFront);
        game.appendChild(tile);
    }
}
