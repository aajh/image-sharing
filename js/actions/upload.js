export const IMAGE_UPLOAD_SELECT_IMAGE = 'IMAGE_UPLOAD_SELECT_IMAGE';
export const IMAGE_UPLOAD_START = 'IMAGE_UPLOAD_START';
export const IMAGE_UPLOAD_COMPLETE = 'IMAGE_UPLOAD_COMPLETE';
export const IMAGE_UPLOAD_CANCEL = 'IMAGE_UPLOAD_CANCEL';

export function selectImage(image) {
    return {
        type: IMAGE_UPLOAD_SELECT_IMAGE,
        image
    }
}

function getImage(state) {
}

export function startUpload() {
    return (dispatch, getState) => {
        const image = getImage(getState())

        if (image === undefined) {
            return Promise.resolve()
        }

        dispatch({ type: IMAGE_UPLOAD_START })

        let formData = new FormData()

        formData.append('image', this.state.image)
        formData.append('title', 'lörslärä')
        formData.append('description', 'Lorem ipsum')

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

export function cancelUpload() {
    return {
        type: IMAGE_UPLOAD_CANCEL
    }
}
