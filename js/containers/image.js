import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadImage, loadComments } from '../actions/images';

class Image extends Component {
    componentWillMount() {
        const { loadImage, params, image } = this.props;
        loadImage(params.image_id);
    }

    reloadComments() {
        const { loadComments, image } = this.props;
        if (image) {
            loadComments(image.id);
        }
    }

    render() {
        const { image } = this.props;

        if (!image) {
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
                  <a href={image.src} target="_blank">
                    <img src={image.src} alt={image.title} />
                  </a>
                </column>
              </row>
              <row className="image-description">
                <column cols="12">
                  <p>{image.description}</p>
                </column>
              </row>
              <row className="image-comments">
                <button onClick={this.reloadComments.bind(this)}>Refresh comments</button>
              </row>
            </div>
        );
    }
}
Image.propTypes = {
    loadImage: PropTypes.func.isRequired,
    loadComments: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
    const { images, comments } = state.entities;
    const id = props.params.image_id;

    if (images && images[id]) {
        return {
            image: images[id],
            comments: (images[id].comments || []).map(c => comments[c])
        };
    } else {
        return {};
    }
}

export default connect(mapStateToProps, { loadImage, loadComments })(Image);
