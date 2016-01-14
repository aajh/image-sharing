import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class MainTitle extends Component {
    render() {
        return (
            <row className="title center-columns">
                <column cols="6">
                   <h1>AbosUr</h1>
                   <p>Simple image uploads</p>
                </column>
            </row>
        );
    }
}

class Upload extends Component {
    render() {
        return (
            <row className="upload center-columns">
                <column cols="6">
                  <p>To upload, drag & drop or <a href="#">select</a> an image.</p>
                </column>
            </row>
        );
    }
}

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        return (
            <div>
              <div className="image-container">
                <div />
                <Link to={`/images/${image.id}`}>
                  <img src={image.src} alt={image.title}/>
                </Link>
              </div>
            </div>
        );
    }
}

class ImageBrowser extends Component {
    render() {
        const images = Object.keys(this.props.images).map(key => {
           const i = this.props.images[key];
           return <SmallImage image={i} key={i.id} />
        });
        return (
            <blocks className="browse" cols="4">
                {images}
            </blocks>
        );
    }
}

class Index extends Component {
    render() {
        const { images } = this.props;
        return (
            <div>
                <MainTitle />
                <Upload />
                <ImageBrowser images={images} />
            </div>
        );
    }
}

function select(state) {
    return state.images;
}

export default connect(select)(Index);
