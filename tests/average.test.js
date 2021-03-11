const { average } = require('./utils/testing');

describe.skip('average', () => {
    test('el valor de uno es el mismo valor', () => {
        expect(average([1])).toBe(1);
    });

    test('varios valores son correctamente calculados', () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });

    test('array vacio es igual a 0', () => {
        expect(average([])).toBe(0);
    });

    test('array undefined es igual a 0', () => {
        expect(average()).toBeUndefined();
    });
});