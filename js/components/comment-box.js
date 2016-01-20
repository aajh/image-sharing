import React, { Component, PropTypes } from 'react';

export default class CommentBox extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            comment: ''
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handlePostClick = this.handlePostClick.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }
    handleCommentChange(e) {
        this.setState({ comment: e.target.value });
    }
    handlePostClick() {
        this.props.onPostClick(this.state);
    }

    render() {
        const { username, comment } = this.state;
        return (
            <row className="comment-box row-centered">
              <column cols="6">
                <input type="text" placeholder="Name"
                       value={username} onChange={this.handleUsernameChange} />
                <textarea placeholder="Comment" rows="4"
                          value={comment} onChange={this.handleCommentChange} />
                <button onClick={this.handlePostClick}
                        className="button-outline button-upper"
                        type="primary">
                  Send
                </button>
              </column>
            </row>
        );
    }
}
CommentBox.propTypes = {
    onPostClick: PropTypes.func.isRequired
};
