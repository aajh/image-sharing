import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Image extends Component {
    render() {
        const { images, params } = this.props;
        const image = images[params.image_id];
        return (
            <div className="image">
                <div className="row image-title">
                    <h1>{image.title}</h1>
                    <p>{image.uploaded.toLocaleDateString()}</p>
                </div>
                <div className="row">
                    <a href={`/${image.src}`}>
                <img src={`/${image.src}`} alt={image.title} width="100%" />
                    </a>
                </div>
                <div className="row image-description">
                    <p>{image.description}</p>
                </div>
            </div>
        );
    }
}

function select(state) {
    return {
        images: state.images.images
    };
}

export default connect(select)(Image);
