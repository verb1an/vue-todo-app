import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'

import components from './components'

const app = createApp(App)

components.forEach(comp => {
    app.component(comp.name, comp)
})

app.use(store).mount('#app')
