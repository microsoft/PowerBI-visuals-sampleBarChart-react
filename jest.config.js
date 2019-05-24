module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        "<rootDir>/tests/test-setup.js"
    ],
    transform: {
        "^.+\\.(css|less|scss)$": "<rootDir>/tests/test-styles-mock.js",
        '^.+\\.tsx?$': 'ts-jest',
        "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [],
    testPathIgnorePatterns: ["/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
