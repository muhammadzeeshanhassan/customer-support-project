import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios/dist/axios.min.js'

function StatusBadge({ status }) {
    const map = { open: 'warning', pending: 'info', closed: 'success' }
    const variant = map[status] || 'secondary'
    return (
        <span className={`badge bg-${variant} text-capitalize me-2`}>
            {status}
        </span>
    )
}

function PriorityBadge({ priority }) {
    const map = { low: 'secondary', medium: 'primary', high: 'danger' }
    const variant = map[priority] || 'dark'
    return (
        <span className={`badge bg-${variant} text-capitalize`}>
            {priority}
        </span>
    )
}

export default function Dashboard({ role, csrfToken, userName }) {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const perPage = 6

    useEffect(() => {
        setLoading(true)
        axios
            .get(`/tickets?page=${page}&per_page=${perPage}`, {
                headers: { Accept: 'application/json' },
                withCredentials: true
            })
            .then(resp => {
                setTickets(resp.data.tickets)
                setMeta(resp.data.meta)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [role, page])

    useEffect(() => {
        function onClick(e) {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        function onKey(e) {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [menuOpen])

    const handleLogout = async () => {
        try {
            await axios.delete('/users/sign_out', {
                headers: { 'X-CSRF-Token': csrfToken },
                withCredentials: true
            })
            window.location.href = '/users/sign_in'
        } catch (err) {
            console.error(err)
        }
    }

    const counts = tickets.reduce(
        (acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1
            return acc
        },
        { open: 0, pending: 0, closed: 0 }
    )

    return (
        <div className="container mt-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Dashboard</h1>
                <div className="position-relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                        aria-label="Profile menu"
                    >
                        <div
                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                            style={{ width: 32, height: 32 }}
                        >
                            {userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="ms-2 text-capitalize">{role}</span>
                    </button>

                    {menuOpen && (
                        <ul
                            className="dropdown-menu show"
                            style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem' }}
                        >
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="row mb-5">
                {['open', 'pending', 'closed'].map(st => (
                    <div key={st} className="col-md-4 mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title text-capitalize">{st}</h5>
                                <p className="display-4 mb-0">{counts[st] || 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <p>Loading tickets…</p>
            ) : tickets.length === 0 ? (
                <p>No tickets to display.</p>
            ) : (
                <div className="row">
                    {tickets.map(t => (
                        <div key={t.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{t.subject}</h5>
                                    <p className="card-text text-truncate flex-grow-1">
                                        {t.description}
                                    </p>
                                    <div className="mb-2">
                                        <StatusBadge status={t.status} />
                                        <PriorityBadge priority={t.priority} />
                                    </div>
                                    <div className="mt-auto">
                                        <a href={`/tickets/${t.id}`} className="btn btn-sm btn-outline-primary me-2">
                                            View
                                        </a>
                                        {(role === 'agent' ||
                                            (role === 'customer' && t.status === 'open')) && (
                                                <a
                                                    href={`/tickets/${t.id}/edit`}
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                >
                                                    Edit
                                                </a>
                                            )}
                                        {role === 'admin' && (
                                            <>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('Delete this ticket?')) return
                                                        await axios.delete(`/tickets/${t.id}`, {
                                                            headers: { 'X-CSRF-Token': csrfToken }
                                                        })
                                                        setTickets(ts => ts.filter(x => x.id !== t.id))
                                                    }}
                                                    className="btn btn-sm btn-outline-danger me-2"
                                                >
                                                    Delete
                                                </button>
                                                <a
                                                    href={`/tickets/${t.id}/assign`}
                                                    className="btn btn-sm btn-dark"
                                                >
                                                    Assign
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {meta && (
                <div className="d-flex justify-content-center my-3">
                    <button
                        className="btn btn-outline-secondary me-2"
                        disabled={meta.current_page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span className="align-self-center mx-2">
                        Page {meta.current_page} of {meta.total_pages} — showing {tickets.length} of{' '}
                        {meta.total_count}
                    </span>
                    <button
                        className="btn btn-outline-secondary ms-2"
                        disabled={meta.current_page >= meta.total_pages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="d-flex justify-content-center gap-2">
                {role === 'admin' && (
                    <a href="/admin/users/new" className="btn btn-outline-secondary">
                        Add Admin / Agent
                    </a>
                )}
                {role === 'customer' && (
                    <a href="/tickets/new" className="btn btn-primary">
                        Create Ticket
                    </a>
                )}
            </div>
        </div>
    )
}