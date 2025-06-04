import {configureStore} from '@reduxjs/toolkit';
import authSliceReducer from './Slices/authSlice.js';
import problemSliceReducer from './Slices/problemSlice.js';
import playlistSliceReducer from './Slices/playlistSlice.js';
import submissionsSliceReducer from './Slices/submissionsSlice.js';
import executeSliceReducer from './Slices/ExecuteSlice.js';
import toggleSliceReducer from './Slices/toggleSlice.js';
import discussionSliceReducer from './Slices/discussionSlice.js';
import repliesSliceReducer from './Slices/repliesSlice.js';

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        problem: problemSliceReducer,
        playlist: playlistSliceReducer,
        submissions: submissionsSliceReducer,
        execute: executeSliceReducer,
        toggle: toggleSliceReducer,
        discussion: discussionSliceReducer,
        replies: repliesSliceReducer
    }
})