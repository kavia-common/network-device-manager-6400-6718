# Security Scans (ESLint)

We use ESLint with security-focused rules to lint the React codebase.

Installed plugins/configs:
- eslint
- eslint-plugin-react (recommended rules)
- eslint-plugin-security (plugin:security/recommended)
- @typescript-eslint/* (parser + plugin) enabled automatically for .ts/.tsx files via overrides

Ignore list:
- build, dist, node_modules, coverage (see .eslintignore)

Run lint:
- `npm run lint` — Lints `src` for .js,.jsx,.ts,.tsx files
- `npm run lint:fix` — Attempts to auto-fix fixable issues

CI note:
- Use the same commands in CI to fail builds on lint errors.
