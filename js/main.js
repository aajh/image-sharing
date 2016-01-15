import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'

import { createHistory } from 'history'
import { Router, Route, IndexRoute } from 'react-router'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import * as reducers from './reducers'

import Template from './components/template'
import Index from './routes/index'
import Image from './routes/image'


const reducer = combineReducers(Object.assign({}, reducers, {
    routing: routeReducer
}));

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(reducer);

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
