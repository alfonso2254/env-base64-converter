import { createApp } from 'vue'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Badge from 'primevue/badge'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'

// Estilos
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
// Importar Tailwind CSS
import './assets/tailwind.css'
import './assets/styles.css'

// Crear tema dinámico basado en preferencias del sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Inicializar tema basado en preferencia guardada o del sistema
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
  document.documentElement.classList.add('dark-theme');
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark-theme');
  document.documentElement.classList.remove('dark');
}

// Crear aplicación
const app = createApp(App)

app.use(PrimeVue, { 
  ripple: true,
  ptOptions: {
    mergeSections: true,
    mergeProps: true
  }
})
app.use(ToastService)

// Registrar directivas
app.directive('tooltip', Tooltip)

// Registrar componentes
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Card', Card)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Divider', Divider)
app.component('Toast', Toast, {position: 'top-right'})
app.component('Badge', Badge)
app.component('InputSwitch', InputSwitch)
app.component('Dialog', Dialog)
app.component('Skeleton', Skeleton)

// Montar aplicación
app.mount('#app')
