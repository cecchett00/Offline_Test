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
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router/router'

library.add(faDownload, faMagnifyingGlass, faPaperPlane, faAngleLeft, faAngleRight, faXmark)

const app = createApp(App).use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())

app.mount('#app')
