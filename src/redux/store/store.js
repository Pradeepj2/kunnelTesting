import {createStore,applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from '../reducers/reducer'
import thunk from 'redux-thunk'
const middleware = [thunk]
export const store = createStore(reducer,composeWithDevTools(applyMiddleware(...middleware)))