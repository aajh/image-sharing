import React, { Component, PropTypes } from 'react';

export default class UploadSelector extends Component {
    constructor() {
        super();
        this.state = {
            dragging: false
        };
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }

    componentDidMount() {
        document.addEventListener('dragenter', this.onDragEnter);
    }
    componentWillUnmount() {
        document.removeEventListener('dragenter', this.onDragEnter);
    }

    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }

    onDrop(e) {
        const { onImageFileSelected } = this.props;
        e.preventDefault();
        this.setState({dragging: false});

        if (e.dataTransfer.files[0]) {
            onImageFileSelected(e.dataTransfer.files[0]);
        }
    }
    onDragOver(e) {
        e.preventDefault();
    }

    onDragEnter(e) {
        const { accept } = this.props;
        const { items } = e.dataTransfer;
        if (items.length !== 0 &&
            accept.indexOf(items[0].type) !== -1) {
                this.setState({dragging: true});
        }
    }
    onDragLeave(e) {
        this.setState({dragging: false});
    }

    render() {
        const { onImageFileSelected, accept } = this.props;
        let dropZone;
        if (this.state.dragging) {
            dropZone = (
                <div className="upload-drop-zone"
                     onDrop={this.onDrop}
                     onDragOver={this.onDragOver}
                     onDragLeave={this.onDragLeave} />
            );
        }
        return (
            <row className="upload-selector row-centered">
              <column cols="6">
                <p>To upload, drag & drop or <a href="#" onClick={this.openFileDialog}>select</a> an image.
                </p>
                <input ref={ref => this.fileInput = ref}
                       type="file" accept={accept.join(' ,')}
                       onChange={e => {
                               if (e.target.files[0]) {
                                   onImageFileSelected(e.target.files[0]);
                                   e.target.value = '';
                               }
                           }}
                       className="hide" />
                {dropZone}
              </column>
            </row>
        );
    }
}
UploadSelector.propTypes = {
    onImageFileSelected: PropTypes.func.isRequired,
    accept: PropTypes.arrayOf(PropTypes.string)
}
UploadSelector.defaultProps = {
    accept: ["image/jpeg", "image/png", "image/gif"]
}
