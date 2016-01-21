import React, { Component } from 'react';

export default class NotFound extends Component {
    render() {
        return (
            <row className="not-found row-centered">
              <column cols="6">
                <h1>Page Not Found</h1>
                <p>Sorry, but the page you were trying to view does not exist.</p>
              </column>
            </row>
        );
    }
}
