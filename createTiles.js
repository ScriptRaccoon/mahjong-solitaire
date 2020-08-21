import { COORDINATES } from "./coordinates.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";

const TILE_OFFSET = 7;
const TOTAL_OFFSET_TOP = 30;
const TOTAL_OFFSET_LEFT = 80;

export function createTiles(clickFunction) {
    const game = document.getElementById("game");
    for (let counter = 0; counter < COORDINATES.length; counter++) {
        const coord = COORDINATES[counter];
        const [x, y, z] = coord;
        const image = images[counter];

        const tileFront = document.createElement("div");
        tileFront.classList.add("tileFront");
        tileFront.style.width = TILE_WIDTH + "px";
        tileFront.style.height = TILE_HEIGHT + "px";
        tileFront.addEventListener("click", () => {
            clickFunction(coord);
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
        tileBack.style.width = TILE_WIDTH - 0.5 * TILE_OFFSET + "px";
        tileBack.style.height = TILE_HEIGHT - 0.5 * TILE_OFFSET + "px";
        tileBack.style.left = -TILE_OFFSET + "px";
        tileBack.style.top = -TILE_OFFSET + "px";

        const leftEdge = document.createElement("div");
        leftEdge.classList.add("leftEdge");
        leftEdge.style.left = -TILE_OFFSET + "px";
        leftEdge.style.top = TILE_HEIGHT - 1.5 * TILE_OFFSET + "px";

        const rightEdge = document.createElement("div");
        rightEdge.classList.add("rightEdge");
        rightEdge.style.left = TILE_WIDTH - 1.5 * TILE_OFFSET + "px";
        rightEdge.style.top = -TILE_OFFSET + "px";

        tile.appendChild(leftEdge);
        tile.appendChild(rightEdge);
        tile.appendChild(tileBack);
        tile.appendChild(tileFront);

        game.appendChild(tile);
    }
}
