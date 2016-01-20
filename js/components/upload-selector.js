import React, { Component, PropTypes } from 'react';

export default class UploadSelector extends Component {
    constructor() {
        super();
        this.openFileDialog = this.openFileDialog.bind(this);
    }

    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }

    render() {
        const { onImageFileSelected } = this.props;
        return (
            <row className="upload-selector row-centered">
              <column cols="6">
                <p>To upload, drag & drop or <a href="#" onClick={this.openFileDialog}>select</a> an image.
                </p>
                <input ref={ref => this.fileInput = ref}
                       type="file" accept="image/jpeg, image/png, image/gif"
                       onChange={e => {
                               if (e.target.files[0]) {
                                   onImageFileSelected(e.target.files[0]);
                                   e.target.value = '';
                               }
                           }}
                       className="hide" />
              </column>
            </row>
        );
    }
}
UploadSelector.propTypes = {
    onImageFileSelected: PropTypes.func.isRequired
}
