import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'

import { createHistory } from 'history'
import { Router, Route, IndexRoute } from 'react-router'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import images from './reducers'

import Template from './components/template'
import Index from './components/index'
import Image from './components/image'


const reducer = combineReducers({
    images,
    routing: routeReducer
});

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);
const store = createStoreWithMiddleware(reducer);

const history = createHistory();
syncReduxAndRouter(history, store);

ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Template}>
          <IndexRoute component={Index} />
          <Route path="/images/:image_id" component={Image} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('mount')
);
