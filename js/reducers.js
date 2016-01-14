const initialState = {
    images: [
        {
            id: "a12",
            title: "An image",
            description: "Lorem ipsum dolorem.",
            uploaded: Date(2015, 12, 29),
            src: "img/sample_1.jpg"
        }
    ]
};

export default function imgApp(state = initialState, action) {
    return state;
}
