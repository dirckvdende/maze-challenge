
export { ProgressBar, ProgressBarPart };

/**
 * Part of a progress bar with a name, background color, and amount (width)
 */
type ProgressBarPart = {
    name: string,
    color: string,
    amount: number,
};

/**
 * A progress bar display with different colors
 */
class ProgressBar {

    // The element that contains everything related to the progress bar
    #element: HTMLElement;
    // The actual progress bar element
    #barElement: HTMLElement;
    // The text above the progress bar
    #labelElement: HTMLElement;
    // Progress bar title
    #title: string;

    /**
     * Constructor
     * @param container The container element to put the progress bar in
     * @param title The title of the progress bar, defaults to "Progress"
     */
    constructor(container: HTMLElement, title: string = "Progress") {
        this.#title = title;
        ({element: this.#element, barElement: this.#barElement, labelElement:
        this.#labelElement} = this.#createHTML(container));
    }

    /**
     * Title/label of the progress bar
     */
    get title() { return this.#title; }
    set title(value: string) {
        this.#title = this.#labelElement.innerText = value;
    }

    /**
     * Update the progress bar display
     * @param options Options for the display:
     * - `total` &mdash; The total "width" of the progress bar, defaults to 1
     * - `parts` &mdash; List of progress bar parts to display, defaults to []
     */
    update(options?: {total?: number, parts?: ProgressBarPart[]}): void {
        options = {...options};
        options.total ??= 1;
        options.parts ??= [];
        this.#barElement.innerHTML = "";
        let extraTitleText: string[] = [];
        for (let part of options.parts) {
            let partElement = document.createElement("div");
            partElement.classList.add("part");
            partElement.style.backgroundColor = part.color;
            let width = options.total == 0 ? 0 : part.amount / options.total;
            partElement.style.width = `${width * 100}%`;
            partElement.innerText = part.name;
            if (part.amount > 0)
                extraTitleText.push(`${part.amount} ${part.name}`);
            this.#barElement.append(partElement);
        }
        if (extraTitleText.length > 0)
            this.#labelElement.innerText = (this.#title + " — " +
            extraTitleText.join(", "));
    }

    /**
     * Remove the progress bar HTML
     */
    remove() {
        this.#element.remove();
    }

    /**
     * Create all necessary HTML for the progress bar
     * @returns Relevant HTML elements that were created
     */
    #createHTML(container: HTMLElement): {element: HTMLElement, barElement:
    HTMLElement, labelElement: HTMLElement} {
        let element = document.createElement("div");
        element.classList.add("progress-bar");
        let labelElement = document.createElement("h3");
        labelElement.classList.add("label");
        labelElement.innerText = this.#title;
        let barElement = document.createElement("div");
        barElement.classList.add("bar");
        element.append(labelElement, barElement);
        container.append(element);
        return {element, barElement, labelElement};
    }

}