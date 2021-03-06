import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {store} from './redux/store/store.js'
import App from './App'
import './index.css'
import './mediaStyle.css'
ReactDOM.render(
<Provider store={store}>
<App/>
</Provider>,
document.getElementById('root'))