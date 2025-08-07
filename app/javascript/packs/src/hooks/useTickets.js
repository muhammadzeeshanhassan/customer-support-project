import { useState, useEffect } from 'react'
import axios from 'axios/dist/axios.min.js'
export function useTickets({
    role,
    csrfToken,
    initialPage = 1,
    perPage = 6
}) {
    const [tickets, setTickets] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(initialPage)

    useEffect(() => {
        setLoading(true)
        setError(null)

        axios
            .get(`/tickets?page=${page}&per_page=${perPage}`, {
                headers: { Accept: 'application/json' },
                withCredentials: true
            })
            .then(resp => {
                setTickets(resp.data.tickets)
                setMeta(resp.data.meta)
            })
            .catch(err => {
                console.error(err)
                setError(err)
            })
            .finally(() => setLoading(false))
    }, [role, page, perPage])

    const deleteTicket = async (id) => {
        await axios.delete(`/tickets/${id}`, {
            headers: { 'X-CSRF-Token': csrfToken },
            withCredentials: true
        })
        setTickets(ts => ts.filter(t => t.id !== id))
    }

    return {
        tickets, meta, loading, error, page, setPage, deleteTicket
    }
}
