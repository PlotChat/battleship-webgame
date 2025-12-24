import { validateName } from '../../Utils/validateName';

describe("Throw error when validating name", () => {
    test.each([
        [undefined], [null], [NaN], [""], [123], ["123"], ["a"]
    ])("Throw error when argument is an invalid value", () => {
        expect((value) => {
            validateName(value);
        }).toThrow()
    })
})