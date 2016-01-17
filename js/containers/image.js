import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { loadImage } from '../actions/images'

class Image extends Component {
    render() {
        const { dispatch, images, params } = this.props;
        const image = images[params.image_id];

        if (!image) {
            dispatch(loadImage(params.image_id));
            return (
                <p>Loading...</p>
            );
        }

        return (
            <div className="image-route">
              <row className="image-title">
                <column cols="12">
                  <h1>{image.title}</h1>
                  <p>{(new Date(image.uploaded)).toLocaleDateString()}</p>
                </column>
              </row>

              <row className="image row-centered">
                <column cols="10">
                  <a href={`${image.src}`} target="_blank">
                    <img src={`${image.src}`} alt={image.title} />
                  </a>
                </column>
              </row>
              <row className="image-description">
                <column cols="12">
                  <p>{image.description}</p>
                </column>
              </row>
            </div>
        );
    }
}

function select(state) {
    return {
        images: state.images
    };
}

export default connect(select)(Image);
