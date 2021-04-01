import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore, { history } from './state/stores';

import { Navigation } from './navigation';

import './App.css';

const store = configureStore();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation.Router history={history} />
            </Provider>
        );
    }
}

export default App;
