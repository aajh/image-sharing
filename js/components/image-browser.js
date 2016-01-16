import React, { Component } from 'react'
import { Link } from 'react-router'

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        return (
            <div><div className="height-to-width">
                <div />
                <Link to={`/images/${image.id}`}>
                  <img src={image.src} alt={image.title}/>
                </Link>
            </div></div>
        );
    }
}

export default class ImageBrowser extends Component {
    render() {
        const images = Object.keys(this.props.images).map(key => {
           const i = this.props.images[key];
           return <SmallImage image={i} key={i.id} />
        });
        return (
            <blocks className="image-browser">
                {images}
            </blocks>
        );
    }
}
