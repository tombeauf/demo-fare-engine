import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Notifications from './Notifications';

const App = props => (
    <div className="app">
        <Notifications />
        <Header />
        { props.children }
    </div>
);

App.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default App;
