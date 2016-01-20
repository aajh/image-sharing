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

const initialLastCommentPostTimeState = Date.now();
export const lastCommentPostTime = createReducer(initialLastCommentPostTimeState, {
    [PostComment.SUCCESS](state, action) {
        return action.payload.timestamp;
    }
});

const initialUploadState = {
    uploadStage: UploadStages.START,
    image: undefined
};

export const upload = createReducer(initialUploadState, {
    [Upload.SELECT_IMAGE](state, action) {
        return Object.assign({}, state, {
            uploadStage: UploadStages.IMAGE_SELECTED,
            image: action.payload.image
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
            uploaded_image_id: action.payload.result
        });
    }
});
