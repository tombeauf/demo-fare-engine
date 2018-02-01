import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNotification as notify } from 'reapop';

import { addTap } from '../actions/taps';
import { notifySuccess, notifyError } from '../helpers/notifications';

import PureComponent from './PureComponent';
import CodeBlock from './CodeBlock';

export class Taps extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        balance: PropTypes.number.isRequired,
        tapIsRequesting: PropTypes.bool.isRequired,
        tapError: PropTypes.bool.isRequired,
    }

    componentWillReceiveProps(newProps) {
        if (!this.props.tapError && newProps.tapError) {
            this.props.dispatch(notify(notifyError('Error adding your tap - perhaps it already exists')));
        }

        if (this.props.tapIsRequesting && !newProps.tapIsRequesting && !newProps.tapError) {
            this.props.dispatch(notify(notifySuccess('Tap added successfully')));
        }
    }

    addTap = () => {
        this.props.dispatch(addTap());
    }

    renderRefreshIcon = () => {
        const icon = this.props.tapIsRequesting ? 'spinner fa-spin' : 'plus-square';

        return <i className={`fa fa-${icon}`} />;
    }

    render() {
        return (
            <section>
                <h3>Taps</h3>
                <hr />
                <div className="section-content">
                    <button
                        disabled={this.props.tapIsRequesting}
                        onClick={this.addTap}
                        className={`btn btn-icon btn-${this.props.tapIsRequesting ? 'warning' : 'success'}`}>
                        { this.renderRefreshIcon() }
                        Add Tap
                    </button>
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
    };
};

export default connect(mapStateToProps)(Taps);
