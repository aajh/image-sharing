import fetch from 'isomorphic-fetch';
import { normalize, arrayOf } from 'normalizr';
import Schemas from '../schemas';

export const IMAGE_UPLOAD_SELECT_IMAGE = 'IMAGE_UPLOAD_SELECT_IMAGE';
export const IMAGE_UPLOAD_START = 'IMAGE_UPLOAD_START';
export const IMAGE_UPLOAD_COMPLETE = 'IMAGE_UPLOAD_COMPLETE';
export const IMAGE_UPLOAD_RESET = 'IMAGE_UPLOAD_RESET';


export const UploadStages = {
    START: 'START',
    IMAGE_SELECTED: 'IMAGE_SELECTED',
    UPLOADING: 'UPLOADING',
    COMPLETE: 'UPLOAD_COMPLETE'
}

export function selectImage(image) {
    return {
        type: IMAGE_UPLOAD_SELECT_IMAGE,
        payload: {
            image
        }
    };
}


export function startUpload(options) {
    return (dispatch, getState) => {
        const image = getState().upload.image;

        if (image === undefined) {
            return Promise.resolve();
        }

        dispatch({ type: IMAGE_UPLOAD_START });

        let formData = new FormData();

        formData.append('image', image);
        formData.append('title', options.title);
        formData.append('description', options.description);

        return fetch('/rest/images', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => (dispatch(completeUpload(json))));
    }
}

function completeUpload(image) {
    let { result, entities } = normalize(image, Schemas.image);
    return {
        type: IMAGE_UPLOAD_COMPLETE,
        payload: {
            image: result,
            entities
        }
    };
}

export function resetUpload() {
    return {
        type: IMAGE_UPLOAD_RESET
    };
}
