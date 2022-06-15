import { createStore } from "@stencil/store";

const { state } = createStore({
    recentLoaded: false,
    recentSearches: [],
    savedPosts: [],
});

export default state;