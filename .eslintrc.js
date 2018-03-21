module.exports = {
    parser: "babel-eslint", // 使用babel-eslint解析支持jsx
    extends: ['standard', 'plugin:react/recommended'],
    plugins: [
        'react'
    ],
    parserOptions: {
        "ecmaVersion": 7, // 支持ES7
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    rules: { // 0,1,2 对应 off warninng error
        'semi': [2, 'always', { 'omitLastInOneLineBlock': true }], // 句末必须加分号，{ 'omitLastInOneLineBlock': true }忽略花括号在同一行（内容也就在同一行了）的语句块中的最后一个分号
        'space-before-function-paren': [2, 'never'], // function左括号之前禁用空格
        'comma-dangle': [2, 'only-multiline'], // 拖尾逗号
    }
};