import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UploadStages, selectImage, resetUpload, startUpload } from '../actions/upload';

class UploadRow extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: ''
        };
    }

    componentDidMount() {
        this.showImage();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.image !== this.props.image) {
            this.showImage();
        }
    }

    showImage() {
        this.img.src = '';

        let reader = new FileReader();
        reader.onload = (e => this.img.src = e.target.result);
        reader.readAsDataURL(this.props.image);
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }
    handleDescriptionChange(e) {
        this.setState({description: e.target.value});
    }


    handleUploadClick() {
        this.props.onUploadClick(this.state);
    }

    render() {
        return (
            <row className="upload-row row-around">
              <column cols="4">
                <div className="image-container">
                  <div />
                  <div className="image-centering">
                    <img ref={ref => this.img = ref}/>
                  </div>
                </div>
              </column>
              <column cols="4">
                <input type="text" placeholder="Title"
                       value={this.state.title}
                       onChange={this.handleTitleChange.bind(this)}/>
                <textarea placeholder="Description"
                          onChange={this.handleDescriptionChange.bind(this)}>
                  {this.state.descprition}
                </textarea>
                <p>
                  <button onClick={this.props.onCancelClick}>
                    Cancel
                  </button>
                  <button onClick={this.handleUploadClick.bind(this)}
                          type="primary">
                    Upload
                  </button>
                </p>
              </column>
            </row>
        );
    }
}

class UploadComplete extends Component {
    render() {
        const { uploadedImage } = this.props;
        return (
            <row className="upload-complete row-centered">
              <column cols="6">
                <p>Upload complete!</p>
                <p>{ `${document.location.origin}/images/${uploadedImage.id}` }</p>
              </column>
            </row>
        );
    }
}

class Upload extends Component {
    componentWillUnmount() {
        this.props.dispatch(resetUpload());
    }

    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }

    render() {
        const { dispatch, upload, uploadedImage } = this.props;
        let additionalRow;
        if (upload.uploadStage === UploadStages.IMAGE_SELECTED ||
            upload.uploadStage === UploadStages.IMAGE_UPLOAD_START) {
            additionalRow = <UploadRow image={upload.image}
                                   onUploadClick={options => dispatch(startUpload(options))}
                                   onCancelClick={() => dispatch(resetUpload())} />
        } else if (upload.uploadStage === UploadStages.COMPLETE) {
            additionalRow = <UploadComplete
                                uploadedImage={uploadedImage}
                                onResetClick={() => dispatch(resetUpload())} />
        }

        return (
            <div className="upload">
              <row className="row-centered">
                <column cols="6">
                  <p>To upload, drag & drop or <a href="#" onClick={this.openFileDialog.bind(this)}>select</a> an image.
                  </p>
                  <input ref={ref => this.fileInput = ref}
                         type="file" accept="image/*"
                         onChange={e => {
                                 if (e.target.files[0]) {
                                     dispatch(selectImage(e.target.files[0]));
                                     e.target.value = '';
                                 }
                             }}
                         className="hide" />
                </column>
              </row>
              {additionalRow}
            </div>
        );
    }
}

function select(state) {
    let uploadedImage;
    if (state.upload.uploadStage === UploadStages.COMPLETE) {
        uploadedImage = state.images[state.upload.uploaded_image_id];
    }
    return {
        upload: state.upload,
        uploadedImage
    };
}

export default connect(select)(Upload);
