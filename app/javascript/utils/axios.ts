// Use Axios as AJAX client
import axios, { AxiosStatic } from "axios";

const initializeAxios = (csrfToken: string): AxiosStatic => {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    // Insert CSRF token into Axios
    // tslint:disable-next-line:no-string-literal
    axios.defaults.headers.common["X_CSRF_TOKEN"] = csrfToken;

    return axios;
};

export default initializeAxios;
