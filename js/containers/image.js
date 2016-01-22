import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadImage, loadComments, postComment } from '../actions/images';
import InputBox from '../components/input-box';

class Comment extends Component {
    render() {
        const { comment } = this.props;
        return (
            <li className="image-comment">
              <h3>{comment.username}<span className="date">{(new Date(comment.timestamp)).toDateString()}</span></h3>
              <hr/>
              <p>{comment.comment}</p>
            </li>
        );
    }
}
Comment.propTypes = {
    comment: PropTypes.object.isRequired
};

class Image extends Component {
    render() {
        const { image } = this.props;
        return (
            <div>
              <row className="image-title row-centered">
                <column cols="10">
                  <h1>
                    {image.title}
                    <span className="date">Posted {(new Date(image.uploaded)).toLocaleDateString()}</span>
                  </h1>
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
              <row className="image-comments row-centered">
                <column cols="7">
                  <ol>
                    {image.comments.map(c =>
                        (<Comment comment={c} key={c.id} />))}
                  </ol>
                </column>
              </row>
            </div>
        );
    }
}
Image.propTypes = {
    image: PropTypes.object.isRequired
};


class ImageRoute extends Component {
    constructor() {
        super();
        this.reloadComments = this.reloadComments.bind(this);
        this.postComment = this.postComment.bind(this);
        this.invalidComment = this.invalidComment.bind(this);
    }

    componentWillMount() {
        const { loadImage, imageId } = this.props;
        loadImage(imageId);
    }

    reloadComments() {
        const { loadComments, image } = this.props;
        if (image) {
            loadComments(image.id);
        }
    }

    postComment(comment) {
        this.props.postComment(Object.assign({}, comment, {
            image_id: this.props.image.id
        }));
    }
    invalidComment(username, comment) {
        return username.length === 0 || comment.length === 0;
    }

    render() {
        const { image, lastCommentPostTime, posting } = this.props;

        if (!image) {
            return (
                <p>Loading...</p>
            );
        }

        return (
            <div className="image-route">
              <Image image={image} />
              <row className="row-centered">
                <column cols="6">
                  <InputBox
                      key={lastCommentPostTime}
                      onPostClick={this.postComment}
                      shortName="username"
                      longName="comment"
                      posting={posting}
                      disabled={this.invalidComment}/>
                </column>
              </row>
            </div>
        );
    }
}
ImageRoute.propTypes = {
    loadImage: PropTypes.func.isRequired,
    loadComments: PropTypes.func.isRequired,
    lastCommentPostTime: PropTypes.any.isRequired,
    posting: PropTypes.bool.isRequired,
    imageId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

function mapStateToProps(state, props) {
    const { images, comments } = state.entities;
    const { lastCommentPostTime, posting } = state.commenting;
    const imageId = props.params.image_id;

    const imageProps = {
        lastCommentPostTime, posting, imageId
    };

    if (images && images[imageId]) {
        return Object.assign({}, imageProps, {
            image: Object.assign({}, images[imageId], {
                comments: (images[imageId].comments || []).map(c => comments[c])
            })
        });
    } else {
        return imageProps;
    }
}

export default connect(mapStateToProps, { loadImage, loadComments, postComment })(ImageRoute);
