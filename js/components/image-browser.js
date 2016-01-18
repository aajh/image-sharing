import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        return (
            <div>
              <div className="height-to-width">
                <div />
                <Link to={`/images/${image.id}`}>
                  <img src={image.src} alt={image.title}/>
                </Link>
              </div>
            </div>
        );
    }
}
SmallImage.propTypes = {
    image: PropTypes.object.isRequired
}

export default class ImageBrowser extends Component {
    render() {
        const images = this.props.images.map(i => {
           return <SmallImage image={i} key={i.id} />
        });
        return (
            <blocks className="image-browser">
              {images}
            </blocks>
        );
    }
}
ImageBrowser.propTypes = {
    images: PropTypes.array.isRequired
}
