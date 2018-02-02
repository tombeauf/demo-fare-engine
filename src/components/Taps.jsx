import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNotification as notify } from 'reapop';

import { addTap, deleteTaps } from '../actions/taps';
import { notifySuccess, notifyError } from '../helpers/notifications';

import PureComponent from './PureComponent';
import CodeBlock from './CodeBlock';

export class Taps extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        balance: PropTypes.string.isRequired,
        tapIsRequesting: PropTypes.bool.isRequired,
        tapError: PropTypes.string,
        deleteIsRequesting: PropTypes.bool.isRequired,
        deleteError: PropTypes.string,
    }

    static defaultProps = {
        tapError: null,
        deleteError: null,
    }

    state = {
        deviceId: 'TEST_DEVICE',
    }

    componentWillReceiveProps(newProps) {
        if (!this.props.tapError && newProps.tapError) {
            this.props.dispatch(notify(notifyError('Error adding your tap')));
        }

        if (this.props.tapIsRequesting && !newProps.tapIsRequesting && !newProps.tapError) {
            this.props.dispatch(notify(notifySuccess('Tap added successfully')));
        }

        if (!this.props.deleteError && newProps.deleteError) {
            console.log(newProps.tapError);
            this.props.dispatch(notify(notifyError('Error deleting your taps')));
        }

        if (this.props.deleteIsRequesting && !newProps.deleteIsRequesting && !newProps.deleteError) {
            this.props.dispatch(notify(notifySuccess('Taps deleted successfully')));
        }
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    addTap = (e) => {
        e.preventDefault();

        this.props.dispatch(addTap());
    }

    deleteTaps = (e) => {
        e.preventDefault();

        this.props.dispatch(deleteTaps());
    }
    // const { description, deviceId, routeId, type, zoneId } = req.body;

    render() {
        console.log(this.props.balance);
        return (
            <section>
                <h3>Taps</h3>
                <hr />
                <div className="section-content">
                    <form className="tap-form" onSubmit={this.addTap}>
                        <div className="form-group">
                            <label htmlFor="deviceId">Device ID</label>
                            <input
                                onChange={this.handleInputChange}
                                type="text"
                                value={this.state.deviceId}
                                className="form-control"
                                id="deviceId" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="routeId">Route ID</label>
                            <input
                                onChange={this.handleInputChange}
                                type="number"
                                className="form-control"
                                id="routeId"
                                placeholder="1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                        </div>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                        </div>
                        <button
                            disabled={this.props.deleteIsRequesting}
                            onClick={this.deleteTaps}
                            className={`btn btn-icon btn-${this.props.deleteIsRequesting ? 'warning' : 'danger'}`}
                            type="button">
                            <i className={`fa fa-${this.props.deleteIsRequesting ? 'spinner fa-spin' : 'trash'}`} />
                            Delete Taps
                        </button>
                        <span className="margin-right" />
                        <button
                            disabled={this.props.tapIsRequesting}
                            onClick={this.addTap}
                            className={`btn btn-icon btn-${this.props.tapIsRequesting ? 'warning' : 'success'}`}
                            type="submit">
                            <i className={`fa fa-${this.props.tapIsRequesting ? 'spinner fa-spin' : 'plus-square'}`} />
                            Add Tap
                        </button>
                    </form>
                </div>
                <div className="section-content">
                    <span className="balance">Balance:</span>
                    <CodeBlock classes="wrap" content={this.props.balance.toString()} />
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
        deleteIsRequesting: state.taps.deleteIsRequesting,
        deleteError: state.taps.deleteError,
    };
};

export default connect(mapStateToProps)(Taps);
