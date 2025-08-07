import axios from 'axios/dist/axios.min.js';

export function useAuth(csrfToken) {
    const login = async (values) => {
        try {
            const { data } = await axios.post(
                '/users/sign_in',
                { user: values },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (err) {
            const response = err.response?.data;
            const message =
                response?.error ||
                (Array.isArray(response?.errors) && response.errors.join(' - ')) ||
                err.message;
            throw new Error(message);
        }
    };

    const signup = async (values) => {
        try {
            const { data } = await axios.post(
                '/users',
                { user: values },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (err) {
            const response = err.response?.data;
            let message = err.message;

            if (response?.error) {
                message = response.error;
            } else if (Array.isArray(response?.errors)) {
                message = response.errors.join(' — ');
            } else if (response?.errors && typeof response.errors === 'object') {
                message = Object
                    .entries(response.errors)
                    .map(
                        ([field, msgs]) =>
                            `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`
                    )
                    .join(' · ');
            }

            throw new Error(message);
        }
    };

    return { login, signup };
}
