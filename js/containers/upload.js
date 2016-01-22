import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { UploadStages, selectImage, resetUpload, startUpload } from '../actions/upload';
import UploadSelector from '../components/upload-selector';
import InputBox from '../components/input-box';

class UploadRow extends Component {
    componentDidMount() {
        this.showImage();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.imageFile !== this.props.imageFile) {
            this.showImage();
        }
    }

    showImage() {
        this.img.src = '';

        let reader = new FileReader();
        reader.onload = (e => this.img.src = e.target.result);
        reader.readAsDataURL(this.props.imageFile);
    }

    invalidImage(title, description) {
        return title.trim().length === 0 || description.trim().length === 0;
    }

    render() {
        const { onUploadClick, onCancelClick, uploading } = this.props;
        return (
            <row className="upload-row row-around">
              <column cols="5">
                <div className="image-container">
                  <div className="image-centering">
                    <img ref={ref => this.img = ref}/>
                  </div>
                </div>
              </column>
              <column cols="5">
                <div className="upload-inputs">
                  <div>
                    <InputBox onPostClick={onUploadClick}
                              postName="Upload"
                              onCancelClick={onCancelClick}
                              cancelName="Cancel"
                              shortName="title"
                              longName="description"
                              posting={uploading}
                              disabled={this.invalidImage}/>
                  </div>
                </div>
              </column>
            </row>
        );
    }
}
UploadRow.propTypes = {
    imageFile: PropTypes.instanceOf(Blob).isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onUploadClick: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired
};

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
UploadComplete.propTypes = {
    uploadedImage: PropTypes.object.isRequired
};


class Upload extends Component {
    componentWillUnmount() {
        this.props.dispatch(resetUpload());
    }

    render() {
        const { dispatch, upload, uploadedImage } = this.props;
        let additionalRow;
        if (upload.uploadStage === UploadStages.IMAGE_SELECTED ||
            upload.uploadStage === UploadStages.UPLOADING) {
            additionalRow = <UploadRow
                                imageFile={upload.imageFile}
                                onUploadClick={options => dispatch(startUpload(options))}
                                onCancelClick={() => dispatch(resetUpload())}
                                uploading={upload.uploadStage === UploadStages.UPLOADING} />
        } else if (upload.uploadStage === UploadStages.COMPLETE) {
            additionalRow = <UploadComplete
                                uploadedImage={uploadedImage}
                                onResetClick={() => dispatch(resetUpload())} />
        }

        return (
            <div className="upload">
              <UploadSelector onImageFileSelected=
                              {file =>
                                  dispatch(selectImage(file))}
                />
              {additionalRow}
            </div>
        );
    }
}
Upload.propTypes = {
    upload: PropTypes.object.isRequired,
    uploadedImage: PropTypes.object
};

function select(state) {
    let uploadedImage;
    if (state.upload.uploadStage === UploadStages.COMPLETE) {
        uploadedImage = state.entities.images[state.upload.uploadedImageId];
    }
    return {
        upload: state.upload,
        uploadedImage
    };
}

export default connect(select)(Upload);
