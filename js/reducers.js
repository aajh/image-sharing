import { combineReducers } from 'redux'
import { IMAGE_UPLOAD_SELECT_IMAGE, IMAGE_UPLOAD_START,
         IMAGE_UPLOAD_COMPLETE, IMAGE_UPLOAD_RESET,
         UploadStages }
from './actions/upload'


const initialImagesState = {
    images: {
        1: {
            id: 1,
            title: "Some flowers",
            description: "Phasellus pulvinar pharetra odio imperdiet tempus.",
            uploaded: new Date("2015-12-29"),
            src: "/img/sample_1.jpg"
        },
        2: {
            id: 2,
            title: "Red-green plants",
            description: "Vivamus faucibus fringilla diam, vel aliquam tortor aliquam ut.",
            uploaded: new Date("2016-01-10"),
            src: "/img/sample_2.jpg"
        },
        3: {
            id: 3,
            title: "Building",
            description: "Donec consectetur ac arcu nec vulputate",
            uploaded: new Date("2016-01-11"),
            src: "/img/sample_3.jpg"
        },
        4: {
            id: 4,
            title: "Lamps",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            uploaded: new Date("2016-01-12"),
            src: "/img/sample_4.jpg"
        },
        5: {
            id: 5,
            title: "Yellow",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            uploaded: new Date("2016-01-12"),
            src: "/img/sample_5.jpg"
        }
    }
};

export function images(state = initialImagesState, action) {
    return state;
}




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
                uploadStage: UploadStages.UPLOAD_COMPLETE
            });
        default:
            return state;
    }
}
