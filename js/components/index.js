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
    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }

    render() {
        return (
            <row className="upload center-columns">
                <column cols="6">
                  <p>To upload, drag & drop or <a href="#" onClick={this.openFileDialog.bind(this)}>select</a> an image.
                  </p>
                  <input ref={(ref) => this.fileInput = ref} type="file" accept="image/*" name="upload" className="hide" />
                </column>
            </row>
        );
    }
}

class SmallImage extends Component {
    render() {
        const image = this.props.image;
        return (
            <div><div>
                <div />
                <Link to={`/images/${image.id}`}>
                  <img src={image.src} alt={image.title}/>
                </Link>
            </div></div>
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
            <blocks className="browse">
                {images}
            </blocks>
        );
    }
}

class Index extends Component {
    render() {
        const { images } = this.props;
        return (
            <div className="index-route">
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
