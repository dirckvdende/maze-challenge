
export { TestPopup };
import { TestSuite } from "./types.mjs";

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
        for (let part of options.parts) {
            let partElement = document.createElement("div");
            partElement.classList.add("part");
            partElement.style.backgroundColor = part.color;
            partElement.style.width = `${part.amount / options.total * 100}%`;
            this.#barElement.append(partElement);
        }
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

/**
 * Test popup element, which runs the tests automatically and displays results.
 * Tests are passed to the constructor as a categorized list
 */
class TestPopup {

    // Test suite executed by this popup
    #tests: TestSuite;
    // Popup container
    #container: HTMLElement;
    // Popup body with content
    #body: HTMLElement;
    // Progress bars for the test groups
    #progressBars: ProgressBar[];

    /**
     * Constructor
     */
    constructor(tests: TestSuite) {
        this.#tests = tests;
        ({container: this.#container, body: this.#body} = this.#createHTML());
        this.#progressBars = this.#createProgressBars();
    }

    /**
     * Close the popup and stop running tests
     */
    close(): void {
        // TODO
    }

    /**
     * Start running tests
     */
    start(): void {
        // TODO
    }

    /**
     * Pause running tests, can be continued again after running start()
     */
    stop(): void {
        // TODO
    }

    /**
     * Create the main popup HTML
     * @returns The container and body of the popup
     */
    #createHTML(): {container: HTMLElement, body: HTMLElement} {
        let container = document.createElement("div");
        container.classList.add("popup-container");
        let popup = document.createElement("div");
        popup.classList.add("popup");
        let head = document.createElement("div");
        head.classList.add("head");
        let title = document.createElement("h2");
        title.classList.add("title");
        title.innerText = "Tests";
        let closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.addEventListener("click", () => this.close());
        let closeButtonContent = document.createElement("span");
        closeButtonContent.classList.add("material-symbols-outlined");
        closeButtonContent.innerText = "close";
        closeButton.append(closeButtonContent);
        head.append(title, closeButton);
        let body = document.createElement("div");
        body.classList.add("body");
        popup.append(head, body);
        container.append(popup);
        document.body.append(container);
        return {container, body};
    }

    /**
     * Create all progress bar elements and return them
     * @returns The progress bar elements
     */
    #createProgressBars(): ProgressBar[] {
        let bars: ProgressBar[] = [];
        for (let group of this.#tests.groups)
            bars.push(new ProgressBar(this.#body, group.name));
        return bars;
    }

}