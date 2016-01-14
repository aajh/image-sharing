import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, Link, IndexRoute } from 'react-router'

import { createHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import imgApp from './reducers'

const reducer = combineReducers(Object.assign({}, imgApp, {
    routing: routeReducer
}));
const store = createStore(reducer);
const history = createHistory();

syncReduxAndRouter(history, store);

const MainTitle = React.createClass({
    render: function() {
        return (
            <div className="row title" >
                <h1>AbosUr</h1>
                <p>Simple image uploads</p>
            </div>
        );
    }
});

const Upload = React.createClass({
    render: function() {
        return (
            <div className="row upload">
                <p>To upload, drag & drop or <a href="#">select</a> an image.</p>
            </div>
        );
    }
});

const SmallImage  = React.createClass({
    render: function() {
        return (
            <div className="col span_3">
            </div>
        );
    }
});


const Browse = React.createClass({
    render: function() {
        return (
            <div className="row gutters browse">
            </div>
        );
    }
});

const Main = React.createClass({
    render: function() {
        return (
            <div>
                <MainTitle />
                <Upload />
                <Link to="/image">Image</Link>
            </div>
        );
    }
});

const Image = React.createClass({
    render: function() {
        return (
            <div className="row gutters">
                <Link to="/">Go back</Link>
            </div>
        );
    }
});

const App = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Main} />
          <Route path="/image" component={Image} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('mount')
);
