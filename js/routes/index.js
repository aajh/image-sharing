import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Upload from '../components/upload'
import ImageBrowser from '../components/image-browser'

import { selectImage } from '../actions/upload'

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

class Index extends Component {
    render() {
        const { dispatch, images, upload } = this.props;
        return (
            <div className="index-route">
                <MainTitle />
                <Upload
            onFileSelected={ e =>
              dispatch(selectImage(e.target.files[0]))
            }
            onUploadClick={
                e => undefined
            }
            image={upload.image}
                />
                <ImageBrowser images={images} />
            </div>
        );
    }
}

function select(state) {
    return {
        images: state.images.images,
        upload: state.upload
    };
}

export default connect(select)(Index);
