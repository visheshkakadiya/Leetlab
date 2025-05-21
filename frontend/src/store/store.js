import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authSliceReducer from './Slices/authSlice.js';
import problemSliceReducer from './Slices/problemSlice.js';

// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['auth'], // Only persist the auth slice
// }

// const rootReducer = combineReducers({
//     auth: authSliceReducer,
//     problem: problemSliceReducer
// })

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) => {
//         const middlewares = getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: ['']
//             },
//         })
//         return middlewares;
//     }
// })

// export const persistor = persistStore(store);

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        problem: problemSliceReducer
    }
})