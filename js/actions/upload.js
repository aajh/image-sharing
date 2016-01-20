import { CALL_API, getJSON } from 'redux-api-middleware';
import { normalize } from 'normalizr';
import Schemas from '../schemas';

export const Upload = {
    SELECT_IMAGE: 'IMAGE_UPLOAD_SELECT_IMAGE',
    START: 'IMAGE_UPLOAD_START',
    SUCCESS: 'IMAGE_UPLOAD_SUCCESS',
    FAILURE: 'IMAGE_UPLOAD_FAILURE',
    RESET: 'IMAGE_UPLOAD_RESET'
}

export const UploadStages = {
    START: 'START',
    IMAGE_SELECTED: 'IMAGE_SELECTED',
    UPLOADING: 'UPLOADING',
    COMPLETE: 'UPLOAD_COMPLETE'
}

export function selectImage(image) {
    return {
        type: Upload.SELECT_IMAGE,
        payload: {
            image
        }
    };
}


export function startUpload(options) {
    return (dispatch, getState) => {
        const { upload } = getState();
        const image = upload.image;
        if (image === undefined) {
            return;
        }

        let formData = new FormData();
        formData.append('image', upload.image);
        formData.append('title', options.title);
        formData.append('description', options.description);

        dispatch({
            [CALL_API]: {
                method: 'POST',
                endpoint: '/rest/images',
                body: formData,
                types: [Upload.START,
                        {
                            type: Upload.SUCCESS,
                            payload: (action, state, res) =>
                                getJSON(res).then(json => normalize(json, Schemas.image))
                        },
                        Upload.FAILURE]
            }
        });
    };
}

export function resetUpload() {
    return {
        type: Upload.RESET
    };
}
