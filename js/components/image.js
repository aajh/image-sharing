import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Image extends Component {
    render() {
        return (
            <div className="row gutters">
                <Link to="/">Go back</Link>
            </div>
        );
    }
};
