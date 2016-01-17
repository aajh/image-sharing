import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Upload from '../components/upload'
import ImageBrowser from '../components/image-browser'

import { selectImage, resetUpload, startUpload } from '../actions/upload'
import { loadImages } from '../actions/images'

class MainTitle extends Component {
    render() {
        return (
            <row className="title row-centered">
              <column cols="6">
                <h1>AbosUr</h1>
                <p>Simple image uploads</p>
              </column>
            </row>
        );
    }
}

class Index extends Component {
    componentDidMount() {
        this.props.dispatch(loadImages());
    }

    render() {
        const { dispatch, images, upload } = this.props;
        return (
            <div className="index-route">
              <MainTitle />
              <Upload
                  uploadStage={upload.uploadStage}
                  onFileSelected={ image =>
                      dispatch(selectImage(image))}
                  onUploadClick={ options =>
                      dispatch(startUpload(options))}
                  onCancelClick={ e =>
                      dispatch(resetUpload())}
                  image={upload.image}
              />
              <ImageBrowser images={images} />
            </div>
        );
    }
}

function select(state) {
    return {
        images: state.images,
        upload: state.upload
    };
}

export default connect(select)(Index);
