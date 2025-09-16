
export { TestPopup };
import { TestSuite } from "./types.mjs";

/**
 * Test popup element, which runs the tests automatically and displays results.
 * Tests are passed to the constructor as a categorized list
 */
class TestPopup {

    // Test suite executed by this popup
    tests: TestSuite;

    /**
     * Constructor
     */
    constructor(tests: TestSuite) {
        this.tests = tests;
    }

}