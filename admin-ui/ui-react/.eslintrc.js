module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "off",
    // ReactV17+ 已经不需要显式 import React 了。所以关闭对 React import 的规则检测。
     "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
}
