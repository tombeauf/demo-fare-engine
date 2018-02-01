import newState from '../helpers/reducer';
import * as types from '../constants/ActionTypes';

const defaultNumbersState = {
    balance: 0,
    tapIsRequesting: false,
    tapError: false,
};

function numbers(state = defaultNumbersState, action) {
    switch (action.type) {
    case types.TAP_RECEIVE:
        return newState(state, {
            balance: parseFloat(action.balance).toFixed(2),
            tapIsRequesting: false,
        });

    case types.TAP_REQUEST:
        return newState(state, {
            tapIsRequesting: true,
            tapError: false,
        });

    case types.TAP_ERROR:
        return newState(state, {
            tapError: true,
            tapIsRequesting: false,
        });

    default:
        return state;
    }
}

export default numbers;
