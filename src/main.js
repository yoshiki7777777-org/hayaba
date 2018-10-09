import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap-reboot.css';

new Vue({
    el: '#app',
    render: h => h(App)
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}
