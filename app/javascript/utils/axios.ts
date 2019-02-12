// Use Axios as AJAX client
import axios from "axios";

const initializeAxios = (csrfToken: string) => {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    // Insert CSRF token into Axios
    // tslint:disable-next-line:no-string-literal
    axios.defaults.headers.common["X_CSRF_TOKEN"] = csrfToken;

    return axios;
};

export default initializeAxios;
