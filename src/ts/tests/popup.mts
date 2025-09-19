
export { TestPopup };
import { Simulator } from "../maze/sim.mjs";
import { TestCase, TestGroup, TestSuite } from "./types.mjs";
import { ProgressBar, ProgressBarPart } from "./progress_bar.mjs";


/**
 * Test result
 */
enum TestResult {
    SUCCESS,
    FAIL,
    ERROR,
    UNKNOWN,
};

/**
 * Internal test case type that has the test case, group, and test result
 */
type InternalTestCase = {
    testCase: TestCase,
    group: TestGroup,
    result: TestResult,
};

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
    // Internal linear list of of tests to execute
    #testsList: InternalTestCase[];
    // Current (or next) index in the tests list
    #index: number;
    // Whether tests are currently running
    #running: boolean;

    /**
     * Constructor
     */
    constructor(tests: TestSuite) {
        this.#tests = tests;
        ({container: this.#container, body: this.#body} = this.#createHTML());
        this.#progressBars = this.#createProgressBars();
        this.#testsList = this.#getTestsList();
        this.#index = 0;
        this.#running = false;
    }

    /**
     * Close the popup and stop running tests
     */
    close(): void {
        this.stop();
        this.#container.remove();
    }

    /**
     * Start running tests
     */
    start(): void {
        this.#running = true;
        let handler = () => {
            if (this.#index >= this.#testsList.length)
                return;
            let internalCase = this.#testsList[this.#index];
            internalCase.result = this.#runCase(internalCase.testCase);
            if (!this.#running)
                return;
            this.#updateProgressBars();
            this.#index++;
            setTimeout(handler, 1);
        };
        setTimeout(handler, 1);
    }

    /**
     * Pause running tests, can be continued again after running start()
     */
    stop(): void {
        this.#running = false;
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

    /**
     * Get a list of tests from the stored test suite
     * @returns The list of tests with a test case and a test group
     */
    #getTestsList(): InternalTestCase[] {
        let tests: InternalTestCase[] = [];
        for (let group of this.#tests.groups)
            for (let testCase of group.cases)
                tests.push({testCase, group, result: TestResult.UNKNOWN});
        return tests;
    }

    /**
     * Update the displayed progress bars
     */
    #updateProgressBars(): void {
        let groupIndex: Map<TestGroup, number> = new Map();
        let parts: ProgressBarPart[][] = [];
        for (let i = 0; i < this.#tests.groups.length; i++) {
            groupIndex.set(this.#tests.groups[i], i);
            parts.push([{
                name: "Success",
                color: "#5a9e5e",
                amount: 0,
            }, {
                name: "Fail",
                color: "#bf4e32",
                amount: 0,
            }, {
                name: "Error",
                color: "#c9b138",
                amount: 0,
            }]);
        }
        for (let internalCase of this.#testsList) {
            if (internalCase.result == TestResult.SUCCESS)
                parts[groupIndex.get(internalCase.group) ?? 0][0].amount++;
            if (internalCase.result == TestResult.FAIL)
                parts[groupIndex.get(internalCase.group) ?? 0][1].amount++;
            if (internalCase.result == TestResult.ERROR)
                parts[groupIndex.get(internalCase.group) ?? 0][2].amount++;
        }
        for (let i = 0; i < this.#tests.groups.length; i++)
            this.#progressBars[i].update({
                total: this.#tests.groups[i].cases.length,
                parts: parts[i],
            });
    }

    /**
     * Run a given test case
     * @param testCase The test case to run
     * @returns The result of the test run
     */
    #runCase(testCase: TestCase): TestResult {
        let sim = new Simulator(testCase.maze);
        let code = (document.getElementById("code") as HTMLInputElement).value;
        sim.stepCode = code;
        sim.simulate({
            stopOnError: true,
        });
        if (testCase.maze.finished)
            return TestResult.SUCCESS;
        if (sim.hasError())
            return TestResult.ERROR;
        return TestResult.FAIL;
    }

}