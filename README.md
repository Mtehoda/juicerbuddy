# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Running the app with an API key

Create a `.env` file in the project root with your Anthropic key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-yourKeyHere
```

Then run the app with `npm run dev`.

## Deploying to GitHub Pages

This repo is configured with `gh-pages` and a deployment workflow.

1. Push the repository to GitHub.
2. Ensure the default branch is `main`.
3. The workflow in `.github/workflows/deploy.yml` will run on push and publish the site to GitHub Pages.

After deployment, your site will be available at:

`https://<your-github-username>.github.io/juicerbuddy/`

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
