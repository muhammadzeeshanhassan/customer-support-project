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

export default function Dashboard({ role, csrfToken }) {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTickets() {
            try {
                let url = '/tickets'

                const resp = await axios.get(url, {
                    headers: { Accept: 'application/json' },
                    withCredentials: true
                })
                setTickets(resp.data)
            } catch (err) {
                console.error('Error fetching tickets', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTickets()
    }, [role])

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
                <div className="btn-group">
                    {role === 'customer' && (
                        <a href="/tickets/new" className="btn btn-primary">
                            Create Ticket
                        </a>
                    )}

                    {role === 'admin' && (
                        <>
                            <a href="/users/sign_up" className="btn btn-outline-dark">
                                Add Agent
                            </a>
                            <a href="/users/sign_up" className="btn btn-outline-dark">
                                Add Admin
                            </a>
                        </>
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
        </div>
    )
}
