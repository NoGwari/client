import {
    AsyncThunk,
    AsyncThunkPayloadCreator,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";

export type ExtraArg<T> = { store: () => T };
export type AsyncThunkConfig<RootState, T = unknown> = {
    state: RootState;
    extra: ExtraArg<RootState>;
    rejectValue: T;
};
export interface IConfig {
    Env?: string;
    Url: IURL;
    token: {
        name: string;
        header: string;
    };
}

export interface IURL {
    BACKEND_URL?: string;
}

export const config: IConfig = {
    Env: process.env.NODE_ENV,
    token: {
        name: "token",
        header: "Authorization",
    },
    Url: {
        BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    },
};


/**
 * axios 생성
 */
export const Http: AxiosInstance = axios.create({
    baseURL: config.Url.BACKEND_URL,
    headers: {
        // enctype: "multipart/form-data",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        Accept: "application/hal+json",
    },
    paramsSerializer: {
        encode: encodeURIComponent,
        indexes: null,
    },
} as  CreateAxiosDefaults);

/**
 *
 * @param type
 * @param thunk
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createThunk = <
    RootState,
    Returned,
    ThunkArg = undefined
    >(
    type: string,
    thunk: AsyncThunkPayloadCreator<
        IRes<Returned>,
        ThunkArg,
        AsyncThunkConfig<RootState>
        >
): AsyncThunk<IRes<Returned>, ThunkArg, AsyncThunkConfig<RootState>> => {
    return createAsyncThunk<
        IRes<Returned>,
        ThunkArg,
        AsyncThunkConfig<RootState>
        >(type, async (arg, thunkAPI) => {
        try {
            return await thunk(arg, thunkAPI);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // console.log("createAppThunk", err);
            return thunkAPI.rejectWithValue(err.message);
        }
    });
};

export function useSelectorEq<STATE, T>(fn: (state: STATE) => T): T {
    return useSelector(fn, shallowEqual);
}

export function isPayloadCode(code: number) {
    switch (code) {
        case 200:
        case 201:
        case 204:
            return true;
        case 400:
        case 404:
        case 405:
        case 409:
        case 460:
        case 500:
        default:
            return false;
    }
}

export type StatePayloadCodeType =
    | "success"
    | "success-none"
    | "fail"
    | "error";

export function statePayloadCode(code: number): StatePayloadCodeType {
    switch (code) {
        case 200:
        case 201:
            return "success";
        case 204:
            return "success-none";
        case 400:
        case 404:
        case 405:
        case 409:
        case 460:
        case 500:
            return "fail";
        default:
            return "error";
    }
}

export function returnRes<T = undefined, K = undefined>(data?: T, page?: K) {
    return {
        code: 200,
        message: "",
        content: data,
        data: data,
        page: page,
    } as IRes<T>;
}


/**
* 서버에서 반환되는 JSON 값 설정
*/
export interface IRes<T> {
    apiLink?: string;
    code: number;
    content?: T;
    data?: T;
    list?: Array<T>;
    success?: boolean;

    message: string;
}
