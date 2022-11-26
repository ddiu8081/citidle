import { render } from 'solid-js/web'

import App from './App'
import '@unocss/reset/eric-meyer.css'
import './index.css'
import 'leaflet/dist/leaflet.css'
import 'uno.css'

render(() => <App />, document.getElementById('root') as HTMLElement)
