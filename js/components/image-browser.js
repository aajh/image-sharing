import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        const style = {
            backgroundImage: `url(${image.src})`
        }
        return (
            <div>
              <div className="height-to-width">
                <Link to={`/images/${image.id}`} style={style} />
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
