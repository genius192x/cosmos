import { createApp } from 'vue'
// import './style.css'
import './assets/index.css'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import '@vuepic/vue-datepicker/dist/main.css'

// Register all Community features

const pinia = createPinia()
const app = createApp(App)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			prefix: 'p',
			darkModeSelector: '.dark',
			cssLayer: false,
		}
	}
});

app.use(pinia)
// app.use(router)
app.mount("#app")
