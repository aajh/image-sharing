import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import { UploadStages } from '../actions/upload'

class ImageRow extends Component {
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

export default class Upload extends Component {

    openFileDialog(e) {
        e.preventDefault();
        this.fileInput.click();
    }

    render() {
        let imageRow;
        if(this.props.uploadStage !== UploadStages.START) {
                imageRow = <ImageRow image={this.props.image}
                          uploadStage={this.props.uploadStage}
                          onUploadClick={this.props.onUploadClick}
                          onCancelClick={this.props.onCancelClick} />
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
                                 this.props.onFileSelected(e.target.files[0]);
                                 e.target.value = '';
                             }
                         }}
                         className="hide" />
                </column>
            </row>
            {imageRow}
            </div>
        );
    }
}
