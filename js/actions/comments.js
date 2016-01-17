import { CALL_API } from 'redux-api-middleware';
import { normalize, arrayOf } from 'normalizr';
import Schemas from '../schemas';

export const Comments = {
    REQUEST: 'LOAD_COMMENTS_REQUEST',
    SUCCESS: 'LOAD_COMMENTS_SUCCESS',
    FAILURE: 'LOAD_COMMENTS_FAILURE'
};

export function loadComments(imageId) {
    return {
        [CALL_API]: {
            method: 'GET',
            endpoint: `/rest/images/${imageId}/comments`,
            types: [Comments.REQUEST, Comments.SUCCESS, Comments.FAILURE],
            transform: (res) => normalize(res, arrayOf(Schemas.comment))
        }
    }
}
