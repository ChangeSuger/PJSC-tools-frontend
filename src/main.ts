import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from './App.vue';
import router from './router';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './assets/style.scss';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ArcoVue);

app.mount('#app');
