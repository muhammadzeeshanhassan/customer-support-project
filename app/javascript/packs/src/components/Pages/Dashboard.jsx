import React, { useState, useEffect, useRef } from 'react'
import { useTickets } from '../../hooks/useTickets'
import { useSession } from '../../hooks/useSession'
import 'bootstrap/dist/css/bootstrap.min.css'

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
    const {
        tickets, meta, loading, error, page, setPage, deleteTicket
    } = useTickets({ role, csrfToken, perPage: 6 })

    const { logout } = useSession(csrfToken)

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        function handleEscape(e) {
            if (e.key === 'Escape') {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [menuOpen])

    const counts = tickets.reduce(
        (acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1
            return acc
        },
        { open: 0, pending: 0, closed: 0 }
    )

    return (
        <div className="container mt-4">
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
                                <button className="dropdown-item" onClick={logout}>
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
            ) : error ? (
                <div className="alert alert-danger">Error loading tickets.</div>
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
                                                        if (!window.confirm('Delete this ticket?')) return
                                                        await deleteTicket(t.id)
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
                <div className="d-flex justify-content-center my-4">
                    <button
                        className="btn btn-outline-secondary me-2"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span className="align-self-center mx-3">
                        Page {meta.current_page} of {meta.total_pages} — showing {tickets.length} of {meta.total_count}
                    </span>
                    <button
                        className="btn btn-outline-secondary ms-2"
                        disabled={page >= meta.total_pages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="d-flex justify-content-center gap-2 mt-4">
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