import App from './src/App.svelte'

try { // Remove the preloader from the DOM
  let preloader = window.document.getElementById('preloader');
  preloader.style.display = 'none';
  preloader.parentNode.remove();
} catch (e) {}

const app = new App({
  target: document.body
})

export default app;
