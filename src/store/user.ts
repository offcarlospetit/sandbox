import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './index';
import jsonata from 'jsonata';

interface UserData {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('https://reqres.in/api/users?delay=1');
    return (await response.json()).data as UserData[];
});

interface RawResponse {
    app: string;
    data: Array<any>;
    numbers: number;
}

export const GetAvailabilityMock = `{
    "data":$exists(data) and $count(data)>1?data:[],
    "numbers":$exists(numbers) and numbers>0?numbers:0,
    "app":$exists(app)?app:"unknow App"
}`;
// TODO: Test me
export function jsonataResponseAdapter<T, V>(
    rawRes: T,
    adapterExpression: string,
): V {
    const expression = jsonata(adapterExpression);
    return expression.evaluate(rawRes) as V;
}

function adaptResponse<T, V>(rawRes: T, adapterExpression: string): V {
    return jsonataResponseAdapter(rawRes, adapterExpression);
}

export const usersAdapter = createEntityAdapter<UserData>();
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.100:3021/' }),
    tagTypes: ['Nps'],
    endpoints: (builder) => ({
        SetNps: builder.mutation<any, any>({
            query: (body) => ({
                url: `nps`,
                body,
                method: 'POST',
            }),
            transformResponse: (response: RawResponse) => adaptResponse(response, GetAvailabilityMock),
        }),
    }),
});

export const { useSetNpsMutation } = api;
export const { endpoints, reducerPath, reducer, middleware } = api;

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState({
        loading: false
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            usersAdapter.setAll(state, action.payload);
            state.loading = false;
        });
        builder.addCase(fetchUsers.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const {
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities: selectUserEntities,
    selectAll: selectAllUsers,
    selectTotal: selectTotalUsers
} = usersAdapter.getSelectors((state: RootState) => state.users);

export default usersSlice.reducer;