import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 이름 설정
const name = "auth";

export interface IAuth {
    name: string;
    token: string;
}

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
