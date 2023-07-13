import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {createAppThunk} from "../common";
import {Http, IRes} from "../../../common";
import {IBoard, IReqBoard} from "./authVo";

// 이름 설정
const name = "board";

export const API_BOARD = "board";

export interface Board {
    board: Array<IBoard>
}

export const apiGBoard = createAppThunk<Array<IBoard>, IReqBoard>(`${name}`, async (params: IReqBoard, thunkAPI) => {
    const res = await Http.get<IRes<Array<IBoard>>>(
        `${API_BOARD}`,
        { params }
    );
    return res.data;
});

// data 를 관리하는 reducer 설정
const loginSlice = createSlice({
    name,
    initialState: {
        board: []
    } as Board,
    reducers: {
        rdxBoard(
            state,
            action: PayloadAction<IBoard[]>
        ) {
            state.board = action.payload;
        },
    },
});
export const { rdxBoard } = loginSlice.actions;
export default loginSlice.reducer;
