import { combineReducers } from 'redux';
import { IMAGE_UPLOAD_SELECT_IMAGE, IMAGE_UPLOAD_START,
         IMAGE_UPLOAD_COMPLETE, IMAGE_UPLOAD_RESET,
         UploadStages }
from './actions/upload';
import { Image, Images } from './actions/images';


function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}


const initialImagesState = {};

export const images = createReducer(initialImagesState, {
    [Image.SUCCESS](state, action) {
        return Object.assign({}, state, {
            [action.payload.id]: action.payload
        });
    },
    [IMAGE_UPLOAD_COMPLETE](state, action) {
        return Object.assign({}, state, {
            [action.image.id]: action.image
        });
    },
    [Images.SUCCESS](state, action) {
        const newImages = Object.keys(action.payload).map(k => action.payload[k])
                                .reduce((imgs, img) => {
                                    imgs[img.id] = img;
                                    return imgs;
        }, {});
        return Object.assign({}, state, newImages);
    }
});


const initialUploadState = {
    uploadStage: UploadStages.START,
    image: undefined
};

export function upload(state = initialUploadState, action) {
    switch(action.type) {
        case IMAGE_UPLOAD_SELECT_IMAGE:
            return Object.assign({}, state, {
                uploadStage: UploadStages.IMAGE_SELECTED,
                image: action.image
            });
        case IMAGE_UPLOAD_RESET:
            return initialUploadState;
        case IMAGE_UPLOAD_START:
            return Object.assign({}, state, {
                uploadStage: UploadStages.UPLOADING
            });
        case IMAGE_UPLOAD_COMPLETE:
            return Object.assign({}, state, {
                uploadStage: UploadStages.COMPLETE,
                uploaded_image_id: action.image.id
            });
        default:
            return state;
    }
}
