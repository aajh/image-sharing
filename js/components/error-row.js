import React, { Component, PropTypes } from 'react';

export default class ErrorRow extends Component {
    render() {
        const { error } = this.props;
        return (
            <row className="row-centered error-row">
              <div className="alert alert-error">
                {error}
              </div>
            </row>
        );
    }
}
ErrorRow.propTypes = {
    error: PropTypes.string.isRequired
};
