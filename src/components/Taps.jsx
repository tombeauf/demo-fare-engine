import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNotification as notify } from 'reapop';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import { addTap } from '../actions/taps';
import { notifySuccess, notifyError } from '../helpers/notifications';

import PureComponent from './PureComponent';

const tapInfo = [
    {
        name: 'id',
        info: 'This must be unique for each tap',
    },
    {
        name: 'atco',
        info: 'Stop atco code',
    },
    {
        name: 'description',
        info: 'Direction of the service ("IN" or "OUT")',
    },
    {
        name: 'device_id',
        info: 'Id of the card that the tap is against',
    },
    {
        name: 'vehicle_id',
        info: 'Dummy vehicle id',
    },
    {
        name: 'route_id',
        info: 'Route name e.g. X39, 500',
    },
    {
        name: 'type',
        info: '"OPEN" tap or "CLOSE" tap depending if you\'re tapping in or out of the bus',
    },
    {
        name: 'tap_time',
        info: 'Time of the tap',
    },
    {
        name: 'zone_id',
        info: 'Stage name e.g. Shillingford, THE SWAN',
    },
];

const selectOptions = [
    {
        label: 'Custom',
        value: '',
    },
    {
        label: 'PR1.2.1 Single Trip',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T07:34:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T07:45:00Z",
        "zone_id": "OXFORD CITY"
    }
]`,
    },
    {
        label: 'PR1.2.2 Single Trip',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T11:50:00Z",
        "zone_id": "Oxford City Centre"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T13:08:00Z",
        "zone_id": "Henley"
    }
]`,
    },
    {
        label: 'PR1.2.3 Single Trip',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "OPEN",
        "tap_time": "2018-01-15T14:32:00Z",
        "zone_id": "Cane End"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "CLOSE",
        "tap_time": "2018-01-15T15:28:00Z",
        "zone_id": "Oxford City Centre"
    }
]`,
    },
    {
        label: 'PR1.2.4 Single Trip',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "OPEN",
        "tap_time": "2018-01-15T09:07:00Z",
        "zone_id": "OXF PARKWAY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "CLOSE",
        "tap_time": "2018-01-15T09:13:00Z",
        "zone_id": "SOUTH PARADE"
    }
]`,
    },
    {
        label: 'PR1.3.1 Incomplete Journey',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "OPEN",
        "tap_time": "2018-01-15T14:04:00Z",
        "zone_id": "SOUTH PARADE"
    }
]`,
    },
    {
        label: 'PR1.3.2 Incomplete Journey',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T10:50:00Z",
        "zone_id": "Oxford City Centre"
    }
]`,
    },
    {
        label: 'PR1.4.1 Multiple journeys - Cityzone',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T07:34:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T07:45:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T09:35:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T10:03:00Z",
        "zone_id": "BLACKBIRD LEYS"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T17:41:00Z",
        "zone_id": "COWLEY CENTRE"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T18:12:00Z",
        "zone_id": "OXF RAIL STN"
    }
]`,
    },
    {
        label: 'PR1.4.2 Multiple journeys - cross-zone',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T07:34:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T07:45:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T09:35:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T10:03:00Z",
        "zone_id": "BLACKBIRD LEYS"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T11:50:00Z",
        "zone_id": "Oxford City Centre"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T13:08:00Z",
        "zone_id": "Henley"
    }
]`,
    },
    {
        label: 'PR1.4.3 Multiple journeys - cross-zone',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T07:34:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T07:45:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T09:35:00Z",
        "zone_id": "OXFORD CITY"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T10:03:00Z",
        "zone_id": "BLACKBIRD LEYS"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T11:50:00Z",
        "zone_id": "Oxford City Centre"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T13:08:00Z",
        "zone_id": "Henley"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T16:33:00Z",
        "zone_id": "Nuneham Courtenay"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T16:48:00Z",
        "zone_id": "Oxford City Centre"
    }
]`,
    },
    {
        label: 'PR1.4.4 Multiple journeys - cross-zone - separate caps',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "OPEN",
        "tap_time": "2018-01-15T10:05:00Z",
        "zone_id": "Reading"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "CLOSE",
        "tap_time": "2018-01-15T10:52:00Z",
        "zone_id": "Wallingford"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "OPEN",
        "tap_time": "2018-01-15T12:00:00Z",
        "zone_id": "Wallingford"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "CLOSE",
        "tap_time": "2018-01-15T12:33:00Z",
        "zone_id": "Reading"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T15:10:00Z",
        "zone_id": "Henley"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T16:21:00Z",
        "zone_id": "Benson Marina"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "OPEN",
        "tap_time": "2018-01-15T07:34:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "5",
        "type": "CLOSE",
        "tap_time": "2018-01-15T07:45:00Z",
        "zone_id": "OXFORD CITY"
    }
]`,
    },
    {
        label: 'PR1.4.5 Multiple journeys - South Oxfordshire Zone only',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "OPEN",
        "tap_time": "2018-01-15T10:05:00Z",
        "zone_id": "Reading"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "CLOSE",
        "tap_time": "2018-01-15T10:52:00Z",
        "zone_id": "Wallingford"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "OPEN",
        "tap_time": "2018-01-15T12:00:00Z",
        "zone_id": "Wallingford"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X39",
        "type": "CLOSE",
        "tap_time": "2018-01-15T12:33:00Z",
        "zone_id": "Reading"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "OPEN",
        "tap_time": "2018-01-15T15:10:00Z",
        "zone_id": "Henley"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "X38",
        "type": "CLOSE",
        "tap_time": "2018-01-15T16:21:00Z",
        "zone_id": "Benson Marina"
    }
]`,
    },
    {
        label: 'PR1.5.1 Return',
        value: `[
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "OPEN",
        "tap_time": "2018-01-15T14:35:00Z",
        "zone_id": "OXF RAIL STN"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        "atco": "340000006R2",
        "description": "OUT",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "CLOSE",
        "tap_time": "2018-01-15T15:08:00Z",
        "zone_id": "KIDLINGTON"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "OPEN",
        "tap_time": "2018-01-15T16:30:00Z",
        "zone_id": "KIDLINGTON"
    },
    {
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
        "atco": "340000006R2",
        "description": "IN",
        "device_id": "TEST_DEVICE_1",
        "vehicle_id": "TESTVEHICLE123",
        "route_id": "500",
        "type": "CLOSE",
        "tap_time": "2018-01-15T17:05:00Z",
        "zone_id": "OXF RAIL STN"
    }
]`,
    },
];

export class Taps extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        balance: React.PropTypes.arrayOf(React.PropTypes.shape({
            deviceId: React.PropTypes.string,
            amount: React.PropTypes.number,
        })).isRequired,
        tapIsRequesting: PropTypes.bool.isRequired,
        tapError: PropTypes.string,
    };

    static defaultProps = {
        tapError: null,
        deleteError: null,
    };

    state = {
        infoShown: false,
        tapData: '',
    };

    componentWillReceiveProps(newProps) {
        if (!this.props.tapError && newProps.tapError) {
            this.props.dispatch(notify(notifyError(newProps.tapError)));
        }

        if (this.props.tapIsRequesting && !newProps.tapIsRequesting && !newProps.tapError) {
            this.props.dispatch(notify(notifySuccess('Taps added successfully')));
        }
    }

    getTapInfoText = () => {
        return tapInfo.map((info) => {
            return (
                <div key={info.name}>
                    <span><strong>{info.name} - </strong></span>
                    <span>{info.info}</span>
                </div>
            );
        });
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    addTap = (e) => {
        let jsonTapData = '';
        e.preventDefault();

        if (!this.state.tapData) {
            this.props.dispatch(notify(notifyError('Please input some taps')));
            return;
        }

        try {
            jsonTapData = JSON.parse(this.state.tapData);
        } catch (err) {
            this.props.dispatch(notify(notifyError(err.message)));
            return;
        }

        if (!jsonTapData || (jsonTapData && !jsonTapData.length)) {
            this.props.dispatch(notify(notifyError('Please input an array of taps')));
            return;
        }

        this.props.dispatch(addTap(jsonTapData));
    };

    handleSelectChange = (e) => {
        this.setState({ tapData: e.target.value });
    };

    recursiveZoneAmountRender (zoneAmount) {
        const savings = parseFloat(zoneAmount.nominalPrice - zoneAmount.adjustedPrice).toFixed(2);
        const hasSavings = zoneAmount.nominalPrice !== zoneAmount.adjustedPrice;

        return (
            <div className={ hasSavings ? 'panel panel-default' : '' } key={_.uniqueId()}>
                { zoneAmount.nominalPrice !== zoneAmount.adjustedPrice
                    && <div className="panel-heading">{ zoneAmount.zoneName } cap (£{ zoneAmount.zoneCap }) applied: you saved £{savings }</div>
                }
                <div className={ hasSavings ? 'panel-body' : '' }>
                    { _.map(zoneAmount.trips, trip => this.tripRender(trip)) }
                    { _.map(zoneAmount.subAmounts, amount => this.recursiveZoneAmountRender(amount)) }
                </div>
            </div>
        );
    }

    tripRender (trip) {
        return (
            <div className="panel panel-default" key={_.uniqueId()}>
                <div className="panel-heading">
                    <b>{ trip.journeys.length > 1 ? 'Return' : 'Single' }</b> Nominal cost: £{ trip.price }
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th width="50%"><b>From</b></th>
                        <th><b>To</b></th>
                    </tr>
                    </thead>
                    <tbody>
                    { _.map(trip.journeys, (journey) => {
                        return (
                            <tr key={_.uniqueId()}>
                                <td>{journey.origin}</td>
                                <td>{journey.destination}</td>
                            </tr>
                        );
                    }) }
                    </tbody>
                </table>
            </div>
        );
    }

    renderBalances = () => {
        return this.props.balance.map((balance) => {
            const { deviceId, zoneAmounts, amount } = balance;
            return (
                <div className="panel panel-default" key={deviceId}>
                    <div className="panel-heading"><span className="pull-right">Total: £{ amount }</span><i className="fa fa-credit-card" /> Device { deviceId } </div>
                    <div className="panel-body">
                        { _.map(zoneAmounts, zoneAmount => this.recursiveZoneAmountRender(zoneAmount)) }
                    </div>
                </div>
            );
        });
    };

    render() {
        const submitIconClassName = `fa fa-${this.props.tapIsRequesting ? 'spinner fa-spin' : 'plus-square'}`;

        return (
            <section>
                <div className="section-content">
                    <h3>Select Test Case</h3>
                    <Row>
                        <Col sm={12}>
                            <select
                                value={this.state.tapData}
                                onChange={this.handleSelectChange}
                                className="form-control">{_.map(selectOptions, (option) => {
                                    return <option key={option.label} label={option.label} value={option.value} />;
                                })}
                            </select>
                        </Col>
                    </Row>
                    <hr />
                    <form className="tap-form" onSubmit={this.addTap}>
                        <Row>
                            <Col xs={6}>
                                <div className="form-group">
                                    <textarea
                                        onChange={this.handleInputChange}
                                        value={this.state.tapData}
                                        style={{ height: 280 }}
                                        className="form-control"
                                        rows="10"
                                        id="tapData" />
                                </div>
                                <div className="margin-top-double">
                                    <button
                                        disabled={this.props.tapIsRequesting}
                                        onClick={this.addTap}
                                        className={`btn btn-icon btn-${this.props.tapIsRequesting ? 'warning' : 'success'}`}
                                        type="submit">
                                        <i className={submitIconClassName} />
                                        Add Taps
                                    </button>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="alert alert-info tap-info">
                                    { this.getTapInfoText() }
                                </div>
                                { this.props.balance.length ?
                                        this.renderBalances() :
                                        <div>No balance</div> }
                            </Col>
                        </Row>
                    </form>
                </div>
                <hr />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        balance: state.taps.balance,
        tapIsRequesting: state.taps.tapIsRequesting,
        tapError: state.taps.tapError,
    };
};

export default connect(mapStateToProps)(Taps);
