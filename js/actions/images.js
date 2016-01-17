import { CALL_API } from 'redux-api-middleware';
import { normalize, arrayOf } from 'normalizr';
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
            types: [Image.REQUEST, Image.SUCCESS, Image.FAILURE],
            transform: (res) => normalize(res, Schemas.image)
        }
    }
}

export function loadImages() {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/`,
            types: [Images.REQUEST, Images.SUCCESS, Images.FAILURE],
            transform: (res) => normalize(res, arrayOf(Schemas.image))
        }
    }
}
