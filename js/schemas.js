import { Schema, arrayOf } from 'normalizr';

const Schemas = {
    image: new Schema('images'),
    comment: new Schema('comments')
};

Schemas.image.define({
    comments: arrayOf(Schemas.comment)
});

Schemas.comment.define({
    image: Schemas.image
});

export default Schemas;
