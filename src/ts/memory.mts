
export { Memory };

/**
 * Object that can hold binary data, and is automatically expanded when
 * loading/storing outside of its range
 */
class Memory {

    // Binary data stored in memory
    #data: boolean[];

    /**
     * Constructor
     */
    constructor() {
        this.#data = [];
    }

    // Number of bits stored
    get size() { return this.#data.length; }

    /**
     * Load a bit from memory. Memory is automally expanded with zeros if needed
     * @param index The index of the bit in memory
     * @returns A boolean with the value of the bit
     */
    load(index: number): boolean {
        while (index >= this.#data.length)
            this.#data.push(false);
        return this.#data[index];
    }

    /**
     * Set a bit in memory. Memory is automatically expanded with zeros if
     * needed
     * @param index The index of the bit in memory
     * @param value A boolean with the value to set the bit to
     */
    store(index: number, value: boolean): void {
        while (index >= this.#data.length)
            this.#data.push(false);
        this.#data[index] = value;
    }

    /**
     * Load an [size]-bit unsigned integer from memory. Memory is automatically
     * expanded with zeros if needed
     * @param index The index of the start of the int
     * @param size The size of the int in bit
     */
    loadUInt(index: number, size: number): number {
        let num = 0;
        for (let i = index + size - 1; i >= index; i--) {
            num <<= 1;
            if (this.load(i))
                num++;
        }
        return num;
    }

    /**
     * Store an [size]-bit unsigned integer in memory. Memory is automatically
     * expanded with zeros if needed
     * @param index The index of the start of the int
     * @param size The size of the int in bit
     * @param value The value of the integer
     */
    storeUInt(index: number, size: number, value: number): void {
        if (value < 0 || value >= (1n << BigInt(size)))
            throw new Error(`Value ${value} cannot be assigned to ${size}` +
            `-bit unsigned integer`);
        for (let i = index; i < index + size; i++) {
            this.store(i, (value & 1) == 1);
            value >>= 1;
        }
    }

}