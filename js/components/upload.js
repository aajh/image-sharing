import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

export default class Upload extends Component {

    componentDidUpdate() {
        if (this.props.image !== undefined) {
            let reader = new FileReader();
            reader.onload = (e => this.img.src = e.target.result);
            reader.readAsDataURL(this.props.image);
        }
    }

    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }
    upload() {
        if (image !== undefined) {
            this.props.onUploadClick();
        }
    }

    render() {
        return (
            <row className="upload center-columns">
                <column cols="6">
                  <p>To upload, drag & drop or <a href="#" onClick={this.openFileDialog.bind(this)}>select</a> an image.
                  </p>
                  <input ref={ref => this.fileInput = ref}
                         type="file" accept="image/*"
                         onChange={e => this.props.onFileSelected(e)}
                         className="hide" />
                  <img ref={ref => this.img = ref}/>
                </column>
            </row>
        );
    }
}
