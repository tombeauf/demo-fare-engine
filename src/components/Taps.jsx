import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNotification as notify } from 'reapop';

import { addTap } from '../actions/taps';
import { notifySuccess, notifyError } from '../helpers/notifications';

import PureComponent from './PureComponent';

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
        deviceId: 'TEST_DEVICE',
        tapData: '',
    }

    componentWillReceiveProps(newProps) {
        if (!this.props.tapError && newProps.tapError) {
            this.props.dispatch(notify(notifyError(newProps.tapError)));
        }

        if (this.props.tapIsRequesting && !newProps.tapIsRequesting && !newProps.tapError) {
            this.props.dispatch(notify(notifySuccess('Taps added successfully')));
        }
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
                <div key={`${deviceId}-${amount}`}className="balance-block">
                    <div className="inline margin-right-double">
                        <strong className="margin-right">
                            <span className="margin-right-half"><i className="fa fa-credit-card" /></span>
                            <span>Device</span>
                        </strong>
                        <span>{ deviceId }</span>
                    </div>
                    <div className="inline margin-right">
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
        return (
            <section>
                <h3>Taps</h3>
                <hr />
                <div className="section-content">
                    <form className="tap-form" onSubmit={this.addTap}>
                        <div className="form-group">
                            <label htmlFor="tapData">Insert taps:</label>
                            <textarea
                                onChange={this.handleInputChange}
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
                                <i className={`fa fa-${this.props.tapIsRequesting ? 'spinner fa-spin' : 'plus-square'}`} />
                                Add Taps
                            </button>
                        </div>
                    </form>
                </div>
                <div className="section-content">
                    { this.props.balance &&
                        this.props.balance[0] &&
                        this.props.balance[0].amount ? this.renderBalances() : 'No balance' }
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
