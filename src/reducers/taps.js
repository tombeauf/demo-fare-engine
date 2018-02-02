import newState from '../helpers/reducer';
import * as types from '../constants/ActionTypes';

const defaultNumbersState = {
    balance: [{}],
    tapIsRequesting: false,
    tapError: null,
};

function numbers(state = defaultNumbersState, action) {
    switch (action.type) {
    case types.TAP_RECEIVE:
        return newState(state, {
            balance: action.balance,
            tapIsRequesting: false,
        });

    case types.TAP_REQUEST:
        return newState(state, {
            tapIsRequesting: true,
            tapError: null,
        });

    case types.TAP_ERROR:
        return newState(state, {
            tapError: action.err,
            tapIsRequesting: false,
            balance: [{}],
        });

    default:
        return state;
    }
}

export default numbers;
