import 'bootstrap/dist/css/bootstrap-reboot.css';

import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#app',
    render: h => h(App)
})

// ServiceWorkerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

// ダブルタップでのズームを抑える
let lastTouch = 0;
document.addEventListener('touchend', event => {
    let now = performance.now();
    if (now - lastTouch <= 300) {
        event.preventDefault();
    }
    lastTouch = now;
}, true);
