import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Upload from './upload';
import ImageBrowser from '../components/image-browser';

import { loadImages } from '../actions/images';

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

class Home extends Component {
    componentDidMount() {
        this.props.loadImages();
    }

    render() {
        const { images } = this.props;
        return (
            <div className="home-route">
              <MainTitle />
              <Upload />
              <ImageBrowser images={images} />
            </div>
        );
    }
}
Home.propTypes = {
    images: PropTypes.array.isRequired,
    loadImages: PropTypes.func.isRequired
};

function select(state) {
    const images = state.entities.images || {};
    return {
        images: Object.keys(images).map(k => images[k]).sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
    };
}

export default connect(select, { loadImages })(Home);
