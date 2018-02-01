import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import App from './App';
import Taps from './Taps';

const Routes = () => (
    <App>
        <Route
            exact path="/" render={() => (
                <Redirect to="taps" />)}
        />
        <Route path="/taps" component={Taps} />
    </App>
);

export default Routes;
