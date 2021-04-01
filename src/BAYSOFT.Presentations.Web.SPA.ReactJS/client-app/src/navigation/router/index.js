import React, { Component } from 'react';

import { ConnectedRouter } from 'connected-react-router';

import {
    Route,
    Switch,
} from "react-router-dom";

import ROUTES from '../routes';

class Router extends Component {
    render() {
        return (
            <ConnectedRouter history={this.props.history}>
                <Switch>
                    {ROUTES.map((route, index) =>
                        <Route
                            exact={true}
                            key={index}
                            name={route.name}
                            path={route.path}
                            params={route.params}
                            component={route.component}
                        />
                    )}
                </Switch>
            </ConnectedRouter>
        );
    }
}

export default Router;