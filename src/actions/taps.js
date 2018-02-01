import axios from 'axios';

import * as types from '../constants/ActionTypes';

const addTapError = () => ({ type: types.TAP_ERROR });
const addTapReceive = balance => ({ type: types.TAP_RECEIVE, balance });
const addTapIsRequesting = () => ({ type: types.TAP_REQUEST });

const addTap = (payload) => {
    return (dispatch) => {
        dispatch(addTapIsRequesting());

        axios.get('http://localhost:3000/api/tap').then((response) => {
            dispatch(addTapReceive(response.data.data));
        }).catch((e) => {
            dispatch(addTapError());
        });
    };
};

module.exports = {
    addTap,
};
