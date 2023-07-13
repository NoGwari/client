import {Http} from "./common";

Http.interceptors.request.use(
    async axiosconfig => {
        axiosconfig.url = axiosconfig.url + "";
        return axiosconfig;
    },
    error => {
        return Promise.reject(error);
    }
);
Http.interceptors.response.use(async response => {
    const isAllowPath = ["/"].includes(location.pathname);
    if (response.data.code === 401 && !isAllowPath) {
        throw Error;
    }
    return response;
});
