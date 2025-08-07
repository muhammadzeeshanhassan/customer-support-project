import React, { useState, useEffect } from 'react'
import axios from 'axios/dist/axios.min.js'
import { Badge, Alert, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ViewTicket({ id }) {
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/tickets/${id}`, {
      headers: { Accept: 'application/json' },
      withCredentials: true
    })
      .then(resp => {
        setTicket(resp.data)
        setError(null)
      })
      .catch(() => {
        setError('Failed to load ticket')
        setTicket(null)
      })
      .finally(() => setLoading(false))
  }, [id])


  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2 align-self-center">Loading ticket…</span>
      </div>
    )
  }
  if (error) return <Alert variant="danger">{error}</Alert>
  if (!ticket) return <Alert variant="warning">Ticket not found</Alert>

  const statusVariant = { open: 'warning', pending: 'info', closed: 'success' }[ticket.status]
  const priorityVariant = { low: 'secondary', medium: 'primary', high: 'danger' }[ticket.priority]

  return (
    <Card className="mt-4 mx-auto" style={{ maxWidth: 600 }}>
      <Card.Header>
        <h4>Ticket #{ticket.id}</h4>
      </Card.Header>
      <Card.Body>
        <Card.Title>{ticket.subject}</Card.Title>
        <Card.Text>{ticket.description}</Card.Text>
        <div className="mb-3">
          <Badge bg={statusVariant}>{ticket.status}</Badge>{' '}
          <Badge bg={priorityVariant}>{ticket.priority}</Badge>
        </div>
        <hr />
        <p><strong>Customer:</strong> {ticket.customer.name} ({ticket.customer.email})</p>
        {ticket.agent && (
          <p><strong>Assigned to:</strong> {ticket.agent.name} ({ticket.agent.email})</p>
        )}
        <Link to="/dashboard">Dashboard</Link>
      </Card.Body>
    </Card>
  )
}
