export function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
}

export function disjoint(list1, list2) {
    return list1.every((a) => list2.every((b) => a.toString() != b.toString()));
}

export function remove(element, list) {
    const i = list.findIndex((search) => search.toString() == element.toString());
    list.splice(i, 1);
}

export function alert(txt) {
    document.getElementById("alert").innerText = txt;
}

export function tileAt(coord) {
    return document.getElementById(coord.toString());
}

export function tileFrontAt(coord) {
    return document.getElementById(coord.toString()).querySelector(".tileFront");
}
