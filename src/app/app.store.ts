import { createStore } from "@stencil/store";

const { state } = createStore({
  recentLoaded: false,
  recentSearches: [],
  savedPosts: [],
  userPk: localStorage.getItem('userpk'),
});

export default state;