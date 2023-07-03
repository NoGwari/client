import {AsyncThunk, AsyncThunkPayloadCreator} from "@reduxjs/toolkit";
import {IRes, AsyncThunkConfig, createThunk } from "../../common";
import { State } from ".";

// /**
// * axios 생성
// */
// const Http: AxiosInstance = axios.create({
//     baseURL: "http://",
//     headers: {
//         // enctype: "multipart/form-data",
//         "Cache-Control": "no-cache",
//         "Content-Type": "application/json",
//         Accept: "application/hal+json",
//     },
//     paramsSerializer: {
//         encode: encodeURIComponent,
//         indexes: null,
//     },
// });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAppThunk = <Returned, ThunkArg = undefined>(
    type: string,
    thunk: AsyncThunkPayloadCreator<
        IRes<Returned>,
        ThunkArg,
        AsyncThunkConfig<State>
        >
): AsyncThunk<IRes<Returned>, ThunkArg, AsyncThunkConfig<State>> => {
    return createThunk<State, Returned, ThunkArg>(type, thunk);
};