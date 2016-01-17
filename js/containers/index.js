import React, { Component, PropTypes } from 'react'
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
        this.props.loadImages();
    }

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
Index.propTypes = {
    images: PropTypes.array.isRequired,
    loadImages: PropTypes.func.isRequired
};

function select(state) {
    const images = state.entities.images || {};
    return {
        images: Object.keys(images).map(k => images[k])
    };
}

export default connect(select, { loadImages })(Index);
