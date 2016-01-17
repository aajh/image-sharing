import { Schema, arrayOf } from 'normalizr';

const Schemas = {
    image: new Schema('images'),
    comment: new Schema('comments')
};

Schemas.image.define({
    comments: arrayOf(Schemas.comment)
});

export default Schemas;
