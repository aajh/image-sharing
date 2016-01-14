import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Image extends Component {
    render() {
        const { images, params } = this.props;
        const image = images[params.image_id];
        return (
            <div className="image">
                <row className="image-title">
                  <column cols="12">
                    <h1>{image.title}</h1>
                    <p>{image.uploaded.toLocaleDateString()}</p>
                  </column>
                </row>

                <row className="center-columns">
                  <column cols="10">
                    <a href={`${image.src}`}>
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
        images: state.images.images
    };
}

export default connect(select)(Image);
