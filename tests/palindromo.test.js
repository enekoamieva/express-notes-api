const { palindromo } = require('./utils/testing');

test.skip('palindromo de eneko correcto', () => {
    const result = palindromo('eneko');

    expect(result).toBe('okene');
});

test.skip('palindromo de eneko con string vacío', () => {
    const result = palindromo('');

    expect(result).toBe('');
});

test.skip('palindromo de eneko undefined', () => {
    const result = palindromo();

    expect(result).toBeUndefined();
});