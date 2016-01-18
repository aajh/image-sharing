import { CALL_API, getJSON } from 'redux-api-middleware';
import { normalize, arrayOf } from 'normalizr';
import { merge } from 'lodash/object';
import Schemas from '../schemas';

export const Image = {
    REQUEST: 'LOAD_IMAGE_REQUEST',
    SUCCESS: 'LOAD_IMAGE_SUCCESS',
    FAILURE: 'LOAD_IMAGE_FAILURE'
};

export const Images = {
    REQUEST: 'LOAD_IMAGES_REQUEST',
    SUCCESS: 'LOAD_IMAGES_SUCCESS',
    FAILURE: 'LOAD_IMAGES_FAILURE'
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

export function loadComments(imageId) {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/${imageId}/comments`,
            types: [Comments.REQUEST,
                    {
                        type: Comments.SUCCESS,
                        payload: (action, state, res) => {
                            return getJSON(res)
                                .then(json =>
                                    json.map(c => Object.assign({}, c, { image: c.image_id })))
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
                    }, Comments.FAILURE]
        }
    }
}
