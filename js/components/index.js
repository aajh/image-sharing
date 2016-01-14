import React, { Component } from 'react'
import { Link } from 'react-router'

class MainTitle extends Component {
    render() {
        return (
            <div className="row title" >
                <h1>AbosUr</h1>
                <p>Simple image uploads</p>
            </div>
        );
    }
};

class Upload extends Component {
    render() {
        return (
            <div className="row upload">
                <p>To upload, drag & drop or <a href="#">select</a> an image.</p>
            </div>
        );
    }
};

class SmallImage extends Component {
    render() {
        return (
            <div className="col span_3">
            </div>
        );
    }
};

class Browse extends Component {
    render() {
        return (
            <div className="row gutters browse">
            </div>
        );
    }
};

export default class Index extends Component {
    render() {
        return (
            <div>
                <MainTitle />
                <Upload />
                <Link to="/image">Image</Link>
            </div>
        );
    }
};
