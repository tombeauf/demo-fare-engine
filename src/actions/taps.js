import axios from 'axios';

import * as types from '../constants/ActionTypes';
import { baseUrl } from '../config';

const addTapError = err => ({ type: types.TAP_ERROR, err });
const addTapReceive = balance => ({ type: types.TAP_RECEIVE, balance });
const addTapIsRequesting = () => ({ type: types.TAP_REQUEST });

const addTap = (payload) => {
    return (dispatch) => {
        dispatch(addTapIsRequesting());

        axios.get(`${baseUrl}/api/tap`).then((response) => {
            dispatch(addTapReceive(response.data.data));
        }).catch((e) => {
            dispatch(addTapError(e.message));
        });
    };
};

const deleteTapsError = err => ({ type: types.DELETE_TAPS_ERROR, err });
const deleteTapsReceive = () => ({ type: types.DELETE_TAPS_RECEIVE });
const deleteTapsIsRequesting = () => ({ type: types.DELETE_TAPS_REQUEST });

const deleteTaps = () => {
    return (dispatch) => {
        dispatch(deleteTapsIsRequesting());

        axios.delete(`${baseUrl}/api/delete-taps`).then(() => {
            dispatch(deleteTapsReceive());
        }).catch((e) => {
            dispatch(deleteTapsError(e.message));
        });
    };
};

module.exports = {
    addTap,
    deleteTaps,
};
