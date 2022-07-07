import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import messageReducer from './messages';
import usersReducer, { api } from './user';

const middlewares = [
    api.middleware
];

export const store = configureStore({
    reducer: {
        message: messageReducer,
        users: usersReducer,
        api: api.reducer
    },
    middleware: middleware => middleware().concat(middlewares)
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => <AppDispatch>useDispatch;