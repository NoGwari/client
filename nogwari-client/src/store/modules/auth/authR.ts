import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {createAppThunk} from "../common";
import {IRes } from "../../../common";
import axios from "axios";

// 이름 설정
const name = "auth";

export interface IAuth {
    name: string;
    token: string;
}

export const apiGBoard = createAppThunk<string, any>(`${name}`, async (params: "", thunkAPI) => {
    const res = await axios.get<IRes<any>>    (
        `http://ec2-13-209-73-184.ap-northeast-2.compute.amazonaws.com/board`,
        { params }
    );
    return res.data;
});

// data 를 관리하는 reducer 설정
const loginSlice = createSlice({
    name,
    initialState: {
        name: "",
    } as IAuth,
    reducers: {
        rdxName(state: IAuth, action: PayloadAction<string>) {
            state.name = action.payload;
        },
    },
});
export const { rdxName } = loginSlice.actions;
// data 를 관리하는 reducer 기본 반환 설정
export default loginSlice.reducer;
