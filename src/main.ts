import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/svg-icon/svg-icon.ts'
import "default-passive-events";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
