import { combineReducers } from 'redux';
import { merge } from 'lodash/object';
import { Upload, UploadStages } from './actions/upload';
import { PostComment } from './actions/images';


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
    if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities);
    }
    return state;
}

const initialCommentingState = {
    lastCommentPostTime: Date.now(),
    posting: false,
    errorMessage: undefined
}
export const commenting = createReducer(initialCommentingState, {
    [PostComment.REQUEST](state, action) {
        return Object.assign({}, state, { posting: true, errorMessage: undefined });
    },
    [PostComment.SUCCESS](state, action) {
        return Object.assign({}, state, {
            lastCommentPostTime: action.payload.timestamp,
            posting: false,
            errorMessage: undefined
        });
    },
    [PostComment.FAILURE](state, action) {
        return Object.assign({}, state, {
            posting: false,
            errorMessage: `Encountered an error while posting the comment. Please try again later.`
        });
    }
});

const initialUploadState = {
    uploadStage: UploadStages.START,
    imageFile: undefined,
    uploadedImageId: undefined,
    errorMessage: undefined
};

export const upload = createReducer(initialUploadState, {
    [Upload.SELECT_IMAGE](state, action) {
        if (state.uploadStage === UploadStages.UPLOADING) {
            return state; // Ignore image select if uploading
        }
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED,
            imageFile: action.payload.image,
            errorMessage: undefined
        });
    },
    [Upload.RESET](state, action) {
        return initialUploadState;
    },
    [Upload.START](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.UPLOADING,
            errorMessage: undefined
        });
    },
    [Upload.SUCCESS](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.COMPLETE,
            uploadedImageId: action.payload.result,
            errorMessage: undefined
        });
    },
    [Upload.FAILURE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED,
            errorMessage: `Encountered an error while uploading the image. Please try again later.`
        });
    }
});
