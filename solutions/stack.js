
function loadStack() {
    let i = 0;
    let stack = [];
    while (loadInt(i * 3, 3) != 0) {
        stack.push(loadInt(i * 3, 3) - 1);
        i++;
    }
    // Initialize stack at [0]
    if (stack.length == 0)
        stack = [0];
    return stack;
}

function storeStack(stack) {
    for (let i = 0; i < stack.length; i++)
        storeInt(i * 3, 3, stack[i] + 1);
    storeInt(stack.length * 3, 3, 0);
}

function hasLoop(stack) {
    let seen = new Set([0]);
    let cur = {x: 0, y: 0};
    for (let dir of stack) {
        switch (dir) {
            case 0: cur.y -= 1; break;
            case 1: cur.x += 1; break;
            case 2: cur.y += 1; break;
            case 3: cur.x -= 1; break;
        }
        if (seen.has(cur.x * 1000000 + cur.y))
            return true;
        seen.add(cur.x * 1000000 + cur.y);
    }
    return false;
}

let stack = loadStack();

while (stack[stack.length - 1] < 4 && (look(stack[stack.length - 1]) == 1 || hasLoop(stack)))
    stack[stack.length - 1]++;

if (stack[stack.length - 1] >= 4) {
    stack.pop();
    move((stack[stack.length - 1] + 2) % 4);
    stack[stack.length - 1]++;
} else {
    move(stack[stack.length - 1]);
    stack.push(0);
}

storeStack(stack);