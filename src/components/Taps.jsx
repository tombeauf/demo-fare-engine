import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNotification as notify } from 'reapop';

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

const tapData = `[
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
]`;

export class Taps extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        balance: React.PropTypes.arrayOf(React.PropTypes.shape({
            deviceId: React.PropTypes.string,
            amount: React.PropTypes.number,
        })).isRequired,
        tapIsRequesting: PropTypes.bool.isRequired,
        tapError: PropTypes.string,
    }

    static defaultProps = {
        tapError: null,
        deleteError: null,
    }

    state = {
        infoShown: false,
        tapData,
    }

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
                <div>
                    <span><strong>{info.name} - </strong></span>
                    <span>{info.info}</span>
                </div>
            );
        });
    }

    toggleInfo = () => {
        this.setState({ infoShown: !this.state.infoShown });
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

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
    }

    renderBalances = () => {
        return this.props.balance.map((balance) => {
            const { deviceId, amount } = balance;

            return (
                <div key={`${deviceId}-${amount}`}className="balance-block margin-top">
                    <div className="inline margin-right">
                        <strong className="margin-right">
                            <span className="margin-right-half"><i className="fa fa-credit-card" /></span>
                            <span>Device</span>
                        </strong>
                        <span>{ deviceId }</span>
                    </div>
                    <div className="inline margin-left">
                        <strong className="margin-right">
                            <span className="margin-right-half"><i className="fa fa-gbp" /></span>
                            <span>Amount</span>
                        </strong>
                        <span>{ parseFloat(amount).toFixed(2) }</span>
                    </div>
                </div>
            );
        });
    }

    render() {
        const submitIconClassName = `fa fa-${this.props.tapIsRequesting ? 'spinner fa-spin' : 'plus-square'}`;

        return (
            <section>
                <h3>Taps</h3>
                <hr />
                <button
                    onClick={this.toggleInfo}
                    className={`btn btn-icon btn-info info-button ${this.state.infoShown ? 'active' : ''}`}>
                    <i className="fa fa-info" />
                    Info
                </button>
                <div className="section-content">
                    <form className="tap-form" onSubmit={this.addTap}>
                        <div className="form-group">
                            <label htmlFor="tapData">Insert taps:</label>
                            <textarea
                                onChange={this.handleInputChange}
                                value={this.state.tapData}
                                className="form-control"
                                rows="10"
                                id="tapData" />
                        </div>
                        { this.state.infoShown &&
                            <div className="alert alert-info tap-info">
                                { this.getTapInfoText() }
                            </div> }
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
                    </form>
                </div>
                <div className="section-content">
                    { this.props.balance &&
                        this.props.balance[0] &&
                        this.props.balance[0].amount ?
                            this.renderBalances() :
                            <div>No balance</div> }
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
