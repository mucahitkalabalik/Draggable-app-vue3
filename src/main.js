import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // MDI

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi', // MDI
  },
})


const pinia = createPinia()
import App from './App.vue'

createApp(App).use(pinia).use(vuetify).mount('#app')
