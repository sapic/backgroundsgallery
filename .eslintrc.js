module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['standard', 'react-app', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
