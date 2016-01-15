import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Upload from '../components/upload'
import ImageBrowser from '../components/image-browser'

class MainTitle extends Component {
    render() {
        return (
            <row className="title center-columns">
                <column cols="6">
                   <h1>AbosUr</h1>
                   <p>Simple image uploads</p>
                </column>
            </row>
        );
    }
}

class Index extends Component {
    render() {
        const { images } = this.props;
        return (
            <div className="index-route">
                <MainTitle />
                <Upload />
                <ImageBrowser images={images} />
            </div>
        );
    }
}

function select(state) {
    return state.images;
}

export default connect(select)(Index);
