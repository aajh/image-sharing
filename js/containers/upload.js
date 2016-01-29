import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { UploadStages, selectImage, resetUpload, startUpload } from '../actions/upload';
import UploadSelector from '../components/upload-selector';
import UploadComplete from '../components/upload-complete';
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
    componentWillUnmount() {
        if (this.props.onWillUnmount) this.props.onWillUnmount();
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
    uploading: PropTypes.bool.isRequired,
    onWillUnmount: PropTypes.func
};


class Upload extends Component {
    constructor() {
        super();
        this.state = {
            completeRow: undefined,
            uploadRow: undefined
        };
        this.addUploadRow = this.addUploadRow.bind(this);
        this.addCompleteRow = this.addCompleteRow.bind(this);
    }
    componentWillMount() {
        this.addCompleteRow();
    }
    componentWillUnmount() {
        this.props.dispatch(resetUpload());
    }
    componentWillReceiveProps(props) {
        const { uploadStage } = props.upload;
        if (uploadStage === UploadStages.IMAGE_SELECTED &&
            this.state.completeRow === undefined) {
                this.addUploadRow(props);
        } else {
            this.setState({uploadRow: undefined});
        }

        if (uploadStage !== UploadStages.COMPLETE &&
            this.state.completeRow !== undefined) {
                this.setState({completeRow: undefined});
        }
    }

    addUploadRow(props = this.props) {
        const { dispatch, upload } = props;
        if (upload.uploadStage !== UploadStages.IMAGE_SELECTED &&
            upload.uploadStage !== UploadStages.UPLOADING)
            return;
        this.setState({
            uploadRow: <UploadRow
                           key={upload.imageFile}
                           imageFile={upload.imageFile}
                           onUploadClick={options => dispatch(startUpload(options))}
                           onCancelClick={() => dispatch(resetUpload())}
                           uploading={upload.uploadStage === UploadStages.UPLOADING}
                           onWillUnmount={this.addCompleteRow} />
        });
    }
    addCompleteRow() {
        const { dispatch, upload, uploadedImageLink } = this.props;
        if (upload.uploadStage === UploadStages.COMPLETE) {
            this.setState({
                completeRow: <UploadComplete
                                 key={uploadedImageLink}
                                 uploadedImageLink={uploadedImageLink}
                                 onWillUnmount={this.addUploadRow} />
            });
        }
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div className="upload">
              <UploadSelector onImageFileSelected=
                              {file =>
                                  dispatch(selectImage(file))}
                />
                <ReactCSSTransitionGroup transitionName="upload"
                                         transitionEnterTimeout={1000}
                                         transitionLeaveTimeout={500}>
                  {this.state.uploadRow}
                  {this.state.completeRow}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
Upload.propTypes = {
    upload: PropTypes.object.isRequired,
    uploadedImageLink: PropTypes.string
};

function select(state) {
    let uploadedImageLink;
    if (state.upload.uploadStage === UploadStages.COMPLETE) {
        uploadedImageLink =
            `${document.location.origin}/images/${state.upload.uploadedImageId}`;
    }
    return {
        upload: state.upload,
        uploadedImageLink
    };
}

export default connect(select)(Upload);
