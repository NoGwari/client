import { AnyAction, ReducersMapObject } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import board, { Board } from "./auth/authR";

/**
 * state interface 설정
 */
export interface State {
    board: Board;
}

/**
 * 베이스 reducer 설정
 * @param state 상태를 담고있는 변수
 * @param action 행동에 의해 변화되는 값들
 * @returns
 */
// 리턴 타입이 무었인지 확인하여야 함
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const rootReducer = (state: State | undefined, action: AnyAction) => {
    switch (action.type) {
        default:
            return combineReducers({
                board,
            } as ReducersMapObject)(state, action);
    }
};

export default rootReducer;
