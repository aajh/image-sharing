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
    posting: false
}
export const commenting = createReducer(initialCommentingState, {
    [PostComment.REQUEST](state, action) {
        return Object.assign({}, state, { posting: true });
    },
    [PostComment.SUCCESS](state, action) {
        return Object.assign({}, state, {
            lastCommentPostTime: action.payload.timestamp,
            posting: false
        });
    },
    [PostComment.FAILURE](state, action) {
        return Object.assign({}, state, { posting: false });
    }
});

const initialUploadState = {
    uploadStage: UploadStages.START,
    imageFile: undefined,
    uploadedImageId: undefined
};

export const upload = createReducer(initialUploadState, {
    [Upload.SELECT_IMAGE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED,
            imageFile: action.payload.image
        });
    },
    [Upload.RESET](state, action) {
        return initialUploadState;
    },
    [Upload.START](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.UPLOADING
        });
    },
    [Upload.SUCCESS](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.COMPLETE,
            uploadedImageId: action.payload.result
        });
    },
    [Upload.FAILURE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED
        });
    }
});
