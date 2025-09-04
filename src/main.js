import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAngleLeft,
  faAngleRight,
  faDownload,
  faMagnifyingGlass,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'

library.add(faDownload, faMagnifyingGlass, faPaperPlane, faAngleLeft, faAngleRight)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())

app.mount('#app')
