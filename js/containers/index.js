import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Upload from '../components/upload'
import ImageBrowser from '../components/image-browser'

import { loadImages } from '../actions/images'

class MainTitle extends Component {
    render() {
        return (
            <row className="title row-centered">
              <column cols="6">
                <h1>AbosUr</h1>
                <p>Simple image uploads</p>
              </column>
            </row>
        );
    }
}

class Index extends Component {
    componentDidMount() {
        this.props.dispatch(loadImages());
    }

    render() {
        const { dispatch, images, upload } = this.props;
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
    return {
        images: state.images,
        upload: state.upload
    };
}

export default connect(select)(Index);
