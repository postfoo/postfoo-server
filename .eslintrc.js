// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        '@stylistic/ts'
    ],
    rules: {
        '@stylistic/ts/indent': ['error', 2], // Using Stylistic's indent rule
        // Add more stylistic rules as needed
    },
};
