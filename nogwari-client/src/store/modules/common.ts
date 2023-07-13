import {AsyncThunk, AsyncThunkPayloadCreator} from "@reduxjs/toolkit";
import {IRes, AsyncThunkConfig, createThunk } from "../../common";
import { useDispatch } from "react-redux";
import { State } from ".";


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

export type StatePayloadCodeType =
    | "success"
    | "success-none"
    | "fail"
    | "error";

export const useAbsApi = <State>(
    buttonComponent?: React.FC,
    width?: number | string,
    inStatePayloadCode?: (code: number) => StatePayloadCodeType
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatch = useDispatch<any>();
    // const navigates = useNavigate();
    const apiResult = async <Returned, ThunkArg>(
        thunk: AsyncThunk<
            IRes<Returned>,
            ThunkArg,
            AsyncThunkConfig<State>
            >,
        param?: ThunkArg,
        errorCallback?: () => void
    ): Promise<IRes<Returned> | undefined> => {
        const res = await dispatch(thunk(param as ThunkArg));
        if (thunk.fulfilled.match(res)) {
            const pcode = inStatePayloadCode ? inStatePayloadCode : statePayloadCode;
            switch (pcode(res.payload.code)) {
                case "success":
                case "success-none":
                    return res.payload as IRes<Returned>;
                case "fail":
                    return { ...res.payload, content: undefined } as IRes<
                        Returned
                        >;
                case "error":
                default:
                    return { ...res.payload, content: undefined } as IRes<
                        Returned>;
            }
        } else if (thunk.rejected.match(res)) {
            console.log("api thunk error", res);
            throw new Error(res.error.message);
        }
    };
    return { apiResult };
};
export const useApi = () => {
    const { apiResult } = useAbsApi();
    return { apiResult };
};
