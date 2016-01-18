import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadImage, loadComments, postComment } from '../actions/images';

class Comment extends Component {
    render() {
        const { comment } = this.props;
        return (
            <li className="image-comment">
              <h3>{comment.username} &mdash; {(new Date(comment.timestamp)).toDateString()}</h3>
              <p>{comment.comment}</p>
            </li>
        );
    }
}
Comment.propTypes = {
    comment: PropTypes.object.isRequired
};

class CommentBox extends Component {
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
            <row className="row-centered">
              <column cols="6">
                <input type="text" placeholder="Name"
                       value={username} onChange={this.handleUsernameChange} />
                <textarea placeholder="Comment"
                          value={comment} onChange={this.handleCommentChange} />
                <button onClick={this.handlePostClick}>Send</button>
              </column>
            </row>
        );
    }
}
CommentBox.propTypes = {
    onPostClick: PropTypes.func.isRequired
};


class Image extends Component {
    constructor() {
        super();
        this.reloadComments = this.reloadComments.bind(this);
        this.postComment = this.postComment.bind(this);
    }
    componentWillMount() {
        const { loadImage, params, image } = this.props;
        loadImage(params.image_id);
    }

    reloadComments() {
        const { loadComments, image } = this.props;
        if (image) {
            loadComments(image.id);
        }
    }
    postComment(comment) {
        this.props.postComment(Object.assign({}, comment, { image_id: this.props.image.id }));
    }

    render() {
        const { image, comments, lastCommentPostTime } = this.props;

        if (!image) {
            return (
                <p>Loading...</p>
            );
        }

        return (
            <div className="image-route">
              <row className="image-title">
                <column cols="12">
                  <h1>{image.title}</h1>
                  <p>{(new Date(image.uploaded)).toLocaleDateString()}</p>
                </column>
              </row>

              <row className="image row-centered">
                <column cols="10">
                  <a href={image.src} target="_blank">
                    <img src={image.src} alt={image.title} />
                  </a>
                </column>
              </row>
              <row className="image-description row-centered">
                <column cols="8">
                  <p>{image.description}</p>
                </column>
              </row>
              <row className="row-centered">
                <column cols="6">
                  <button onClick={this.reloadComments}>Refresh comments</button>
                </column>
              </row>
              <row className="image-comments row-centered">
                <column cols="6">
                  <ol>{comments.map(c => (<Comment comment={c} key={c.id} />))}</ol>
                </column>
              </row>
              <CommentBox key={lastCommentPostTime} onPostClick={this.postComment} />
            </div>
        );
    }
}
Image.propTypes = {
    loadImage: PropTypes.func.isRequired,
    loadComments: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
    const { images, comments } = state.entities;
    const id = props.params.image_id;

    if (images && images[id]) {
        return {
            image: images[id],
            comments: (images[id].comments || []).map(c => comments[c]),
            lastCommentPostTime: state.lastCommentPostTime
        };
    } else {
        return {};
    }
}

export default connect(mapStateToProps, { loadImage, loadComments, postComment })(Image);
