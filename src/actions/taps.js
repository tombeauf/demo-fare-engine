import axios from 'axios';

import * as types from '../constants/ActionTypes';
import { baseUrl } from '../config';

const addTapError = err => ({ type: types.TAP_ERROR, err });
const addTapReceive = balance => ({ type: types.TAP_RECEIVE, balance });
const addTapIsRequesting = () => ({ type: types.TAP_REQUEST });

const addTap = (tapData) => {
    return (dispatch) => {
        dispatch(addTapIsRequesting());

        const payload = {
            taps: tapData,
        };

        axios.post(`${baseUrl}/api/taps`, payload).then((response) => {
            const { balances } = response.data;

            if (!balances || !balances[0] || !balances[0].deviceId) {
                console.log(response);
                dispatch(addTapError('error'));
            } else {
                dispatch(addTapReceive(balances));
            }
        }).catch((e) => {
            console.log('made it', e);
            dispatch(addTapError(e.message));
        });
    };
};

module.exports = {
    addTap,
};
