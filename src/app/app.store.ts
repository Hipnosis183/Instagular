import { createStore } from "@stencil/store";

const { state } = createStore({
  languageSelected: localStorage.getItem('language') || 'en',
  languageUpdated: true,
  recentLoaded: false,
  recentSearches: [],
  savedPosts: [],
  userPage: null,
  userProfile: JSON.parse(localStorage.getItem('user') || '{}'),
});

export default state;