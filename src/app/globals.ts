export const API = "http://localhost:8080/api/";

export function isLogged() {
    var token = getToken();

    if (token == null || token == "")
        return false;

    return true;
};

export function logout() {
    localStorage.removeItem("id_token");
};

export function getToken() {
    return localStorage.getItem('id_token');
}