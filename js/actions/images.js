import { CALL_API } from 'redux-api-middleware';

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
            types: [Image.REQUEST, Image.SUCCESS, Image.FAILURE]
        }
    }
}

export function loadImages() {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/`,
            types: [Images.REQUEST, Images.SUCCESS, Images.FAILURE]
        }
    }
}
