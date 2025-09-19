// Current coordinates, where start is (64, 64)
let x = loadInt(0, 7);
let y = loadInt(7, 7);
if (x == 0 && y == 0)
    x = y = 64;
let dir = loadInt(14, 2);

function relative(x, y, dir) {
    switch (dir) {
        case 0: return [x, y - 1];
        case 1: return [x + 1, y];
        case 2: return [x, y + 1];
        case 3: return [x - 1, y];
    }
    return [x, y];
}

function hasVisited(x, y) {
    return loadBit(16 + x * 64 + y);
}

let scores = [];
for (let d = 0; d < 4; d++) {
    if (look(d) == 1) {
        scores.push(0);
        continue;
    }
    if (hasVisited(...relative(x, y, dir)))
        scores.push(1);
    else
        scores.push(2);
}
let mx = Math.max(...scores);
dir--;
if (dir < 0)
    dir += 4;
while (scores[dir] != mx)
    dir = (dir + 1) % 4;
let [newX, newY] = relative(x, y, dir);
storeInt(0, 7, newX);
storeInt(7, 7, newY);
storeInt(14, 2, dir);
move(dir);





