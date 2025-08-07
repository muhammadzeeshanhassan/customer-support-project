import React, { useState, useEffect } from 'react'
import axios from 'axios/dist/axios.min.js'


function StatusBadge({ status }) {
    const map = {
        open: 'warning',
        pending: 'info',
        closed: 'success',
    }
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
    const perPage = 6

    const handleLogout = async () => {
        try {
            await axios.delete('/users/sign_out', {
                headers: { 'X-CSRF-Token': csrfToken },
                withCredentials: true
            })
            window.location.href = '/users/sign_in'
        } catch (err) {
        }
    }

    useEffect(() => {
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

    const counts = { open: 0, pending: 0, closed: 0 }

    tickets.forEach(t => {
        if (t.status === 'open') counts.open += 1
        else if (t.status === 'pending') counts.pending += 1
        else if (t.status === 'closed') counts.closed += 1
    })

    return (
        <div className="container mt-2 mr-2 ml-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Dashboard</h1>
                <div className="position-relative">
                    <button
                        onClick={() => setMenuOpen(open => !open)}
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
                                <button
                                    className="dropdown-item"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="row mb-5">
                {['open', 'pending', 'closed'].map((st) => (
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
                    {tickets.map((t) => (
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

                                        <a
                                            href={`/tickets/${t.id}`}
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            View
                                        </a>
                                        {(role === 'agent' || (role === 'customer' && t.status === 'open')) && (
                                            <a
                                                href={`/tickets/${t.id}/edit`}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                            >
                                                Edit
                                            </a>
                                        )}

                                        {role == 'admin' && <button
                                            onClick={async () => {
                                                if (!confirm('Delete this ticket?')) return
                                                await axios.delete(`/tickets/${t.id}`, {
                                                    headers: { 'X-CSRF-Token': csrfToken }
                                                })
                                                setTickets(tickets.filter(x => x.id !== t.id))
                                            }}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            Delete
                                        </button>}

                                        {role == "admin" && (
                                            <a
                                                href={`/tickets/${t.id}/assign`}
                                                className="btn btn-sm btn-dark m-1"
                                            >
                                                Assign
                                            </a>
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
                    {meta.total_pages > 1 ? (
                        <>
                            <button
                                className="btn btn-outline-secondary me-2"
                                disabled={meta.current_page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                            <span className="align-self-center mx-2">
                                Page {meta.current_page} of {meta.total_pages} - {" "} Showing {tickets.length} of {meta.total_count} tickets
                            </span>
                            <button
                                className="btn btn-outline-secondary ms-2"
                                disabled={meta.current_page >= meta.total_pages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </>
                    ) : (
                        <span className="align-self-center">
                            Page {meta.current_page} of {meta.total_pages} - {" "}
                            Showing {tickets.length} of {meta.total_count} tickets
                        </span>
                    )}
                </div>
            )}
            <div className=" row justify-content-center">
                {role === 'admin' && (
                    <a href="/admin/users/new" className="btn btn-outline-secondary ml-2">
                        Add Admin / Agent
                    </a>
                )}
            </div>
        </div>
    )
}
