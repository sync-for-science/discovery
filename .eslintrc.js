module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  ignorePatterns: ['config/webpack.config.js'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'class-methods-use-this': ['warn'],
    'consistent-return': ['warn'],
    'guard-for-in': ['warn'],
    'implicit-arrow-linebreak': ['warn'],
    'import/extensions': ['warn'],
    'import/no-cycle': ['warn'],
    'import/no-extraneous-dependencies': ['warn'],
    'import/no-unresolved': ['warn'],
    'import/prefer-default-export': ['warn'],
    'jsx-a11y/click-events-have-key-events': ['warn'],
    'jsx-a11y/control-has-associated-label': ['warn'],
    'jsx-a11y/label-has-associated-control': ['warn'],
    'jsx-a11y/no-static-element-interactions': ['warn'],
    'max-len': [
      'error',
      180,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-case-declarations': ['warn'],
    'no-continue': ['warn'],
    'no-lonely-if': ['warn'],
    'no-mixed-operators': ['warn'],
    'no-nested-ternary': ['warn'],
    'no-param-reassign': ['warn'],
    'no-plusplus': ['warn'],
    'no-prototype-builtins': ['warn'],
    'no-restricted-globals': ['warn'],
    'no-restricted-properties': ['warn'],
    'no-restricted-syntax': ['warn'],
    'no-return-assign': ['warn'],
    'no-shadow': ['warn'],
    'no-unused-expressions': ['warn'],
    'no-unused-vars': ['warn'],
    'prefer-const': ['warn'],
    'prefer-rest-params': ['warn'],
    radix: ['warn'],
    'react/button-has-type': ['warn'],
    'react/destructuring-assignment': ['warn', 'always'],
    'react/forbid-prop-types': ['warn'],
    'react/jsx-filename-extension': ['warn'],
    'react/jsx-indent': ['warn'],
    'react/jsx-no-bind': ['warn'],
    'react/no-access-state-in-setstate': ['warn'], // < FIX THIS ASAP:
    'react/no-array-index-key': ['warn'],
    'react/no-did-update-set-state': ['warn'],
    'react/no-string-refs': ['warn'],
    'react/no-unused-prop-types': ['warn'],
    'react/no-unused-state': ['warn'],
    'react/prefer-stateless-function': ['warn'],
    'react/prop-types': ['warn'],
    'react/require-default-props': ['warn'],
    'react/sort-comp': ['warn'],
    'react/state-in-constructor': ['warn'],
    'react/static-property-placement': ['warn'],
  },
};