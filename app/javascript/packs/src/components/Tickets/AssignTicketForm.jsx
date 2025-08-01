import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'

export default function AssignTicketForm({ ticketId, csrfToken }) {
  const [agents, setAgents] = useState([])
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    axios
      .get('/agents', {
        headers: { Accept: 'application/json' },
        withCredentials: true
      })
      .then(resp => setAgents(resp.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    axios
      .get(`/tickets/${ticketId}`, {
        headers: { Accept: 'application/json' },
        withCredentials: true
      })
      .then(resp => setTicket(resp.data))
      .catch(console.error)
  }, [ticketId])

  if (!ticket) return null

  return (
    <Formik
      initialValues={{ agent_id: ticket.agent_id || '' }}
      validate={values => {
        const errors = {}
        if (!values.agent_id) {
          errors.agent_id = 'Please select an agent'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        if (
          ticket.agent_id &&
          ticket.agent_id.toString() !== values.agent_id
        ) {
          const current = agents.find(
            a => a.id.toString() === ticket.agent_id.toString()
          )
          const name = current ? current.name : 'another agent'
          if (
            !window.confirm(
              `This ticket is currently assigned to ${name}.\n` +
              `Are you sure you want to assign it to someone else?`
            )
          ) {
            setSubmitting(false)
            return
          }
        }

        try {
          await axios.patch(
            `/tickets/${ticketId}/assign_ticket`,
            { ticket: { agent_id: values.agent_id } },
            {
              headers: {
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          )
          window.location.href = '/dashboard'
        } catch (err) {
          console.error('Assign error →', err.response?.data)
          setErrors({ general: 'Assignment failed' })
        } finally {
          setSubmitting(false)
        }
      }}
    >
       {({ isSubmitting, errors }) => (
        <div className="container mr-1 ml-1 mt-3">
          <Form className="d-flex align-items-center">
            <Field
              as="select"
              name="agent_id"
              className="form-select me-2"
              disabled={isSubmitting}
            >
              <option value="">Assign to…</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </Field>
            <ErrorMessage name="agent_id" component="div" className="text-danger me-3" />

            <button type="submit" className="btn btn-md  btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning…' : 'Assign'}
            </button>

            {errors.general && (
              <div className="text-danger ms-3">{errors.general}</div>
            )}
          </Form>
        </div>
      )}
    </Formik>
  )
}
