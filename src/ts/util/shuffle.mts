
export { shuffle };

/**
 * Randomly shuffle a list in-place. All permutations are equally likely
 * @param list The list to shuffle
 */
function shuffle<T>(list: T[]): void {
    for (let i = 0; i < list.length; i++) {
        let j = Math.floor(Math.random() * (list.length - i))
        if (j == i)
            continue
        let t = list[i]
        list[i] = list[j]
        list[j] = t
    }
}