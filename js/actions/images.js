import { CALL_API, getJSON } from 'redux-api-middleware';
import { normalize, arrayOf } from 'normalizr';
import { merge } from 'lodash/object';
import URLSearchParams from 'url-search-params';
import Schemas from '../schemas';

export const Image = {
    REQUEST: 'LOAD_IMAGE_REQUEST',
    SUCCESS: 'LOAD_IMAGE_SUCCESS',
    FAILURE: 'LOAD_IMAGE_FAILURE'
};

export function loadImage(id) {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/${id}`,
            types: [Image.REQUEST,
                    {
                        type: Image.SUCCESS,
                        payload: (action, state, res) => {
                            return getJSON(res).then(json => normalize(json, Schemas.image));
                        }
                    },
                    Image.FAILURE]
        }
    }
}


export const Images = {
    REQUEST: 'LOAD_IMAGES_REQUEST',
    SUCCESS: 'LOAD_IMAGES_SUCCESS',
    FAILURE: 'LOAD_IMAGES_FAILURE'
};

export function loadImages() {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/`,
            types: [Images.REQUEST,
                    {
                        type: Images.SUCCESS,
                        payload: (action, state, res) => {
                            return getJSON(res).then(json => normalize(json, arrayOf(Schemas.image)));
                        }
                    },
                    Images.FAILURE]
        }
    }
}


export const Comments = {
    REQUEST: 'LOAD_COMMENTS_REQUEST',
    SUCCESS: 'LOAD_COMMENTS_SUCCESS',
    FAILURE: 'LOAD_COMMENTS_FAILURE'
};

function normalizeComments(imageId, state, res) {
    return getJSON(res)
        .then(json => json.map(c => Object.assign({}, c, { image: c.image_id })))
        .then(json => normalize(json, arrayOf(Schemas.comment)))
        .then(json => {
            if (!state.entities.images[imageId]) {
                return json;
            }
            const newImg = Object.assign({},
                                         state.entities.images[imageId],
                                         { comments: json.result });
            return merge({}, json, {
                entities: {
                    images: {
                        [imageId]: newImg
                    }}});
        });
}

export function loadComments(imageId) {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/${imageId}/comments`,
            types: [Comments.REQUEST,
                    {
                        type: Comments.SUCCESS,
                        payload: (action, state, res) => normalizeComments(imageId, state, res)
                    },
                    Comments.FAILURE]
        }
    }
}


export const PostComment = {
    REQUEST: "POST_COMMENT_REQUEST",
    SUCCESS: "POST_COMMENT_SUCCESS",
    FAILURE: "POST_COMMENT_FAILURE"
};

export function postComment(comment) {
    let searchParams = new URLSearchParams();
    searchParams.append("username", comment.username);
    searchParams.append("comment", comment.comment);
    return {
        [CALL_API]: {
            method: 'POST',
            endpoint: `/rest/images/${comment.image_id}/comments?${searchParams.toString()}`,
            types: [PostComment.REQUEST,
                    {
                        type: PostComment.SUCCESS,
                        payload: (action, state, res) =>
                            normalizeComments(comment.image_id, state, res)
                            .then(payload => Object.assign({}, payload, { timestamp: Date.now() }))
                    },
                    PostComment.FAILURE]
        }
    }
}
