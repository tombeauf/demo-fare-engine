import newState from '../helpers/reducer';
import * as types from '../constants/ActionTypes';

const defaultNumbersState = {
    balance: 0,
    tapIsRequesting: false,
    tapError: null,
    deleteIsRequesting: false,
    deleteError: null,
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
            tapError: null,
        });

    case types.TAP_ERROR:
        return newState(state, {
            tapError: action.err,
            tapIsRequesting: false,
        });

    case types.DELETE_TAPS_REQUEST:
        return newState(state, {
            deleteIsRequesting: true,
            deleteError: null,
        });

    case types.DELETE_TAPS_ERROR:
        return newState(state, {
            deleteError: action.err,
            deleteIsRequesting: false,
        });

    case types.DELETE_TAPS_RECEIVE:
        return newState(state, {
            deleteError: null,
            deleteIsRequesting: false,
        });

    default:
        return state;
    }
}

export default numbers;
