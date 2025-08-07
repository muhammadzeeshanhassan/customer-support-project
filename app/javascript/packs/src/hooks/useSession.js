import axios from 'axios/dist/axios.min.js'

export function useSession(csrfToken) {
    const logout = async () => {
        await axios.delete('/users/sign_out', {
            headers: { 'X-CSRF-Token': csrfToken },
            withCredentials: true
        })
        window.location.href = '/users/sign_in'
    }

    return { logout }
}
