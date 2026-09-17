class HttpRequest {
    constructor() {
        this.baseUrl = "https://spotify.f8team.dev/api/";
    }

    async #send(path, method, data, options = {}) {
        try {
            const _options = {
                ...options,
                method,
                headers: {
                    ...options.headers,
                },
            };
            if (data) {
                const dataType = _options.headers["Content-Type"];
                if (data instanceof FormData) _options.body = data;
                else {
                    _options.headers["Content-Type"] = "application/json";
                    _options.body = JSON.stringify(data);
                }
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                _options.headers.Authorization = `Bearer ${accessToken}`;
            }

            const res = await fetch(`${this.baseUrl}${path}`, _options);
            const response = await res.json();

            if (!res.ok) {
                const error = new Error("HTTP Error: ", res.status);
                error.response = response;
                error.status = res.status;
                throw error;
            }

            return response;
        } catch (error) {
            console.log(path);
            throw error;
        }
    }

    get(path, options) {
        return this.#send(path, "GET", null, options);
    }

    post(path, data, options) {
        return this.#send(path, "POST", data, options);
    }

    put(path, data, options) {
        return this.#send(path, "PUT", data, options);
    }

    patch(path, data, options) {
        return this.#send(path, "PATCH", data, options);
    }

    del(path, options) {
        return this.#send(path, "DELETE", null, options);
    }
}

const httpRequest = new HttpRequest();

export default httpRequest;
