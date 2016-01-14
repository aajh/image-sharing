import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class MainTitle extends Component {
    render() {
        return (
            <div className="row title" >
                <h1>AbosUr</h1>
                <p>Simple image uploads</p>
            </div>
        );
    }
}

class Upload extends Component {
    render() {
        return (
            <div className="row upload">
                <p>To upload, drag & drop or <a href="#">select</a> an image.</p>
            </div>
        );
    }
}

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        return (
            <div className="col span_3">
                <Link to={`/images/${image.id}`}>
                  <img src={image.src} width="100%" />
                </Link>
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
        let grouped = [];
        for (let i = 0; i < images.length; i = i + 4) {
            grouped.push(images.slice(i, i + 4));
        }
        return (
            <div className="browse">
                {grouped.map((row, i) =>
                            <div key={i} className="row gutters">
                              {row}
                            </div>
                )}
            </div>
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
