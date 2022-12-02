import App from './App.svelte'


try { // Remove the preloader from the DOM
    let preloader = window.document.getElementById('preloader');
    preloader.style.display = 'none';
    preloader.parentNode.parentNode.removeChild(preloader.parentNode);
} catch (e) {}

const app = new App({
    target: document.getElementById('app')
})

export default app;
