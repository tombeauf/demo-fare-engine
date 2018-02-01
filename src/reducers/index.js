import { combineReducers } from 'redux';
import { reducer as notificationsReducer } from 'reapop';

import taps from './taps';

export default combineReducers({
    taps,
    notifications: notificationsReducer(),
});
