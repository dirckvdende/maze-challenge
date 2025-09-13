
export { DisjointUnion };

/**
 * A disjoint union of a fixed number of elements
 */
class DisjointUnion {

    // Number of elements in the DSU
    n: number
    // Size of the set, if the index corresponds with a root node
    sizes: number[]
    // Parent node, -1 if root node
    prev: number[]

    /**
     * Constructor
     * @param n The number of elements in the DSU
     */
    constructor(n: number) {
        this.n = n
        this.sizes = []
        this.prev = []
        for (let i = 0; i < n; i++) {
            this.sizes.push(1)
            this.prev.push(-1)
        }
    }

    /**
     * Find the root representative of an element
     * @param x The element to find the root of
     * @returns The root of the element
     */
    find(x: number): number {
        if (x < 0 || x >= this.n)
            throw Error(`Invalid input number x: ${x}`)
        if (this.prev[x] == -1)
            return x
        return this.prev[x] = this.find(this.prev[x])
    }
    
    /**
     * Combine the sets of two elements
     * @param x The first element
     * @param y The second element
     */
    combine(x: number, y: number): void {
        if ((x = this.find(x)) == (y = this.find(y)))
            return
        if (this.sizes[x] < this.sizes[y]) {
            let t = x
            x = y
            y = t
        }
        this.prev[y] = x
        this.sizes[x] += this.sizes[y]
    }

}