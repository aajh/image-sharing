import React, { Component, PropTypes } from 'react';
import Clipboard from 'clipboard';


// Fallback copy message with super advanced browser detection
function fallbackMessage(action) {
    let actionKey = (action === 'cut' ? 'X' : 'C');

    if(/iPhone|iPad/i.test(navigator.userAgent)) {
        return 'No support :(';
    }
    else if (/Mac/i.test(navigator.userAgent)) {
        return `Press ⌘-${actionKey} to ${action}`;
    }
    else {
        return `Press Ctrl-${actionKey} to ${action}`;
    }
}

export default class UploadComplete extends Component {
    constructor() {
        super();
        this.state = {
            infoMessage: ''
        }
        this.removeTooltip = this.removeTooltip.bind(this);
    }
    componentDidMount() {
        this.clipboard = new Clipboard('.upload-complete button');
        this.clipboard.on('success', e => {
            e.clearSelection();
            this.button.classList.add('tooltip');
            this.button.classList.add('copy-success');
        });
        this.clipboard.on('error', e => {
            this.setState({ infoMessage: fallbackMessage(e.action) });
            this.button.classList.add('tooltip');
            this.button.classList.add('copy-info');
        });
    }
    componentWillUnmount() {
        if (this.clipboard) {
            this.clipboard.destroy();
            this.clipboard = undefined;
        }
        if (this.props.onWillUnmount) this.props.onWillUnmount();
    }

    removeTooltip() {
        this.setState({ infoeMessage: '' });
        this.button.classList.remove('tooltip');
        this.button.classList.remove('copy-success');
        this.button.classList.remove('copy-info');
    }

    render() {
        const { uploadedImageLink } = this.props;
        const { infoMessage } = this.state;
        const msg = infoMessage || 'Copied!';
        return (
            <row className="upload-complete row-centered">
              <column cols="6">
                <p>Upload complete!</p>
                <div className="btn-append">
                  <input id="upload-complete-link" type="text"
                         value={uploadedImageLink} readOnly="true" />
                  <span><button ref={ref => this.button = ref}
                                data-tooltip-msg={msg}
                                data-clipboard-target="#upload-complete-link"
                                onMouseLeave={this.removeTooltip}>
                    <div />
                  </button></span>
                </div>
              </column>
            </row>
        );
    }
}
UploadComplete.propTypes = {
    uploadedImageLink: PropTypes.string.isRequired,
    onWillUnmount: PropTypes.func
};
