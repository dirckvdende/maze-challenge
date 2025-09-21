let dir = loadInt(0, 2);
dir = dir == 0 ? 3 : dir - 1;
while (look(dir) == 1)
    dir = (dir + 1) % 4;
storeInt(0, 2, dir);
move(dir);