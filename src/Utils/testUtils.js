export function expectPropertyValidation(createObject, property, invalidValues) {
    describe(`${property} validation`, () => {
        test.each(invalidValues)(`throws when ${property} is set to %p`, (val) => {
            const obj = createObject();
            expect(() => {
                obj[property] = val;
            }).toThrow();
        });
    });
}