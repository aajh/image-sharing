import React, { Component, PropTypes } from 'react';

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

export default class InputBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            short: '',
            long: ''
        };
        this.handleShortChange = this.handleShortChange.bind(this);
        this.handleLongChange = this.handleLongChange.bind(this);
        this.handlePostClick = this.handlePostClick.bind(this);
    }

    handleShortChange(e) {
        this.setState({ short: e.target.value });
    }
    handleLongChange(e) {
        this.setState({ long: e.target.value });
    }
    handlePostClick() {
        const { onPostClick, shortName, longName, posting } = this.props;
        if (!posting) {
            onPostClick({
                [shortName]: this.state.short,
                [longName]: this.state.long
            });
        }
    }

    render() {
        const { onCancelClick,
                postName, cancelName,
                shortName, longName,
                disabled, posting
        } = this.props;
        const { short, long } = this.state;
        let cancelButton;
        if (cancelName && onCancelClick) {
            cancelButton = (
                <button onClick={onCancelClick}
                        className="button-outline button-upper"
                        disabled={posting}>
                  {cancelName}
                </button>);
        }
        return (
            <div className="input-box">
              <input type="text" placeholder={capitalize(shortName)}
                     value={short} onChange={this.handleShortChange} />
              <textarea placeholder={capitalize(longName)} rows="4"
                        value={long} onChange={this.handleLongChange} />
              <p>
                {cancelButton}
                <button onClick={this.handlePostClick}
                        className="button-outline button-upper"
                        type="primary"
                        disabled={disabled(short, long)}>
                  {postName + (posting ? 'ing' : '')}
                </button>
              </p>
            </div>
        );
    }
}
InputBox.propTypes = {
    onPostClick: PropTypes.func.isRequired,
    postName: PropTypes.string,
    onCancelClick: PropTypes.func,
    cancelName: PropTypes.string,
    shortName: PropTypes.string.isRequired,
    longName: PropTypes.string.isRequired,
    posting: PropTypes.bool,
    disabled: PropTypes.func
};
InputBox.defaultProps = {
    postName: 'Post',
    posting: false,
    disabled: () => false
};

