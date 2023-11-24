// main.ts
import { createApp } from 'vue';
import router from './router';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi';


import App from './App.vue';


createApp(App).use(router).mount('#app');