import {
    configureStore,
    EnhancedStore,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDefaultMiddleware,
} from "@reduxjs/toolkit";
// import logger from "redux-logger";
import rootReducer, { State } from "./modules/index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store: EnhancedStore<State> = configureStore({
    // reducer 등록
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
} as any);

export default store;
