import "../../src/utils/Array.extensions";
import assert from "power-assert";

describe("Array.associate()", () => {
    it("success", async () => {
        const a = [1, 2, 3];
        const expected = { 1: 10, 2: 20, 3: 30 }
        const actual = a.associate((it) => [it, it*10])
        assert.deepEqual(expected, actual);
    });
});
