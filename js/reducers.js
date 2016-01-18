import { combineReducers } from 'redux';
import { IMAGE_UPLOAD_SELECT_IMAGE, IMAGE_UPLOAD_START,
         IMAGE_UPLOAD_COMPLETE, IMAGE_UPLOAD_RESET,
         UploadStages }
from './actions/upload';
import { Comments } from './actions/images';


function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

const initialEntitiesState = {
    images: {},
    comments: {}
};

export function entities(state = initialEntitiesState, action) {
    let additionalEntities = Object.assign({}, initialEntitiesState);
    if (action.type === Comments.SUCCESS && state.images[action.payload.imageId]) {
        const imageId = action.payload.imageId;
        additionalEntities.images[imageId] = Object.assign({},
                                                           state.images[imageId],
                                                           action.payload.result);
    }
    if (action.payload && action.payload.entities) {
        return Object.assign(additionalEntities, state, action.payload.entities);
    }
    return state;
}


const initialUploadState = {
    uploadStage: UploadStages.START,
    image: undefined
};

export const upload = createReducer(initialUploadState, {
    [IMAGE_UPLOAD_SELECT_IMAGE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED,
            image: action.payload.image
        });
    },
    [IMAGE_UPLOAD_RESET](state, action) {
        return initialUploadState;
    },
    [IMAGE_UPLOAD_START](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.UPLOADING
        });
    },
    [IMAGE_UPLOAD_COMPLETE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.COMPLETE,
            uploaded_image_id: action.payload.image
        });
    }
});
