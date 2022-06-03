import { createStore } from "@stencil/store";

const { state } = createStore({
    savedPosts: [],
});

export default state;