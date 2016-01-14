const initialState = {
    images: {
        1: {
            id: 1,
            title: "Some flowers",
            description: "Phasellus pulvinar pharetra odio imperdiet tempus.",
            uploaded: new Date(2015, 12, 29),
            src: "/img/sample_1.jpg"
        },
        2: {
            id: 2,
            title: "Red-green plants",
            description: "Vivamus faucibus fringilla diam, vel aliquam tortor aliquam ut.",
            uploaded: new Date(2016, 1, 10),
            src: "/img/sample_2.jpg"
        },
        3: {
            id: 3,
            title: "Building",
            description: "Donec consectetur ac arcu nec vulputate",
            uploaded: new Date(2016, 1, 11),
            src: "/img/sample_3.jpg"
        },
        4: {
            id: 4,
            title: "Lamps",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            uploaded: new Date(2016, 1, 12),
            src: "/img/sample_4.jpg"
        },
        5: {
            id: 5,
            title: "Yellow",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            uploaded: new Date(2016, 1, 12),
            src: "/img/sample_5.jpg"
        }
    }
};

export default function images(state = initialState, action) {
    return state;
}
