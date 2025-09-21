let totalCells = mazeSize * mazeSize;

let x = loadInt(totalCells * 3, logSize);
let y = loadInt(totalCells * 3 + logSize, logSize);

function done(x, y) { return loadBit(x * mazeSize + y); }
function setDone(x, y) { storeBit(x * mazeSize + y, 1); }

function backDir(x, y) {
    return loadInt(totalCells + 2 * (x * mazeSize + y), 2);
}
function setBackDir(x, y, d) {
    storeInt(totalCells + 2 * (x * mazeSize + y), 2, d);
}

function mod(x, m) {
    let y = x % m;
    if (y < 0)
        y += m;
    return y;
}

function relative(x, y, dir) {
    switch (dir) {
        case 0: return {x, y: mod(y - 1, mazeSize)};
        case 1: return {x: mod(x + 1, mazeSize), y};
        case 2: return {x, y: mod(y + 1, mazeSize)};
        case 3: return {x: mod(x - 1, mazeSize), y};
    }
    return {x, y};
}

function run() {
    setDone(x, y);
    for (let d = 0; d < 4; d++) {
        let {x: tx, y: ty} = relative(x, y, d);
        if (look(d) == 1)
            continue;
        if (done(tx, ty))
            continue;
        setBackDir(tx, ty, (d + 2) % 4);
        storeInt(totalCells * 3, logSize, tx);
        storeInt(totalCells * 3 + logSize, logSize, ty);
        move(d);
        return;
    }
    let bd = backDir(x, y);
    let {x: tx, y: ty} = relative(x, y, bd);
    storeInt(totalCells * 3, logSize, tx);
    storeInt(totalCells * 3 + logSize, logSize, ty);
    move(backDir(x, y));
}

run();