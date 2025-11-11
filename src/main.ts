import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { initAccountChangeWatcher } from '@/shared/lib';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

// Initialize the account change watcher
initAccountChangeWatcher();

app.mount('#app');
