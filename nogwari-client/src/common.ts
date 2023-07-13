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

export const Http = config.Url.BACKEND_URL;