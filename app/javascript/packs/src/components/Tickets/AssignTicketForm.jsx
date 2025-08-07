import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'

export default function AssignTicketFormik({ ticketId, csrfToken }) {
  const [agents, setAgents] = useState([])
  const [initialAgentId, setInitialAgentId] = useState('')

  useEffect(() => {
    axios
      .get('/agents', { headers: { Accept: 'application/json' }, withCredentials: true })
      .then(r => setAgents(r.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    axios
      .get(`/tickets/${ticketId}.json`, { headers: { Accept: 'application/json' }, withCredentials: true })
      .then(r => setInitialAgentId(r.data.agent_id || ''))
      .catch(console.error)
  }, [ticketId])

  return (
    <Formik
      enableReinitialize
      initialValues={{ agent_id: initialAgentId }}
      validate={values => {
        const errors = {}
        if (!values.agent_id) {
          errors.agent_id = 'Please select an agent'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        if (
          initialAgentId &&
          values.agent_id !== initialAgentId
        ) {
          const oldAgent = agents.find(a => a.id.toString() === initialAgentId.toString())
          const newAgent = agents.find(a => a.id.toString() === values.agent_id)
          const oldName = oldAgent ? oldAgent.name : 'no one'
          const newName = newAgent ? newAgent.name : 'no one'
          if (
            !window.confirm(
              `This ticket is currently assigned to ${oldName}.\n` +
              `Are you sure you want to assign it to ${newName}?`
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
          setErrors({ general: 'Assignment failed' })
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting, errors }) => (
        <div className="container mt-3">
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

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning…' : 'Assign'}
            </button>
          </Form>

          {errors.general && (
            <div className="text-danger mt-2">{errors.general}</div>
          )}
        </div>
      )}
    </Formik>
  )
}
