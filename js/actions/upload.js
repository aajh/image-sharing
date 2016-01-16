export const IMAGE_UPLOAD_SELECT_IMAGE = 'IMAGE_UPLOAD_SELECT_IMAGE';
export const IMAGE_UPLOAD_START = 'IMAGE_UPLOAD_START';
export const IMAGE_UPLOAD_COMPLETE = 'IMAGE_UPLOAD_COMPLETE';
export const IMAGE_UPLOAD_RESET = 'IMAGE_UPLOAD_RESET';

export const UploadStages = {
    START: 'START',
    IMAGE_SELECTED: 'IMAGE_SELECTED',
    UPLOADING: 'UPLOADING',
    UPLOAD_COMPLETE: 'UPLOAD_COMPLETE'
}

export function selectImage(image) {
    return {
        type: IMAGE_UPLOAD_SELECT_IMAGE,
        image
    }
}

function getImage(state) {
    return state.upload.image;
}

export function startUpload(options) {
    return (dispatch, getState) => {
        const image = getImage(getState())

        if (image === undefined) {
            return Promise.resolve()
        }

        dispatch({ type: IMAGE_UPLOAD_START })

        let formData = new FormData()

        formData.append('image', image)
        formData.append('title', options.title)
        formData.append('description', options.description)

        return fetch('/rest/images', {
            method: 'POST',
            body: formData
        })
            .then(() => dispatch(completeUpload()))
    }
}

export function completeUpload() {
    return {
        type: IMAGE_UPLOAD_COMPLETE
    }
}

export function resetUpload() {
    return {
        type: IMAGE_UPLOAD_RESET
    }
}
