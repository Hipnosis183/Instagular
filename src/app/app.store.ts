import { createStore } from "@stencil/store";

const { state } = createStore({
  languageSelected: localStorage.getItem('language') || 'en',
  languageUpdated: true,
  recentLoaded: false,
  recentSearches: [],
  savedPosts: [],
  userPk: localStorage.getItem('userpk'),
});

export default state;