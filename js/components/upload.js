import React, { Component } from 'react'

export default class Upload extends Component {
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
