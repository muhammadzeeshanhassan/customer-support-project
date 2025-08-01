// app/javascript/src/components/Tickets/AddTicketForm.jsx
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'

export default function AddTicketForm({ csrfToken }) {
  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Create a Ticket</h2>

      <Formik
        initialValues={{
          subject: '',
          description: '',
          priority: 'low'
        }}
        validate={values => {
          const errors = {}
          if (!values.subject)     errors.subject     = 'Required'
          if (!values.description) errors.description = 'Required'
          return errors
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await axios.post(
              '/tickets',                
              { ticket: values },
              {
                headers: {
                  'X-CSRF-Token': csrfToken,
                  'Content-Type':  'application/json'
                },
                withCredentials: true    
              }
            )
            window.location.href = '/dashboard'
          } catch (err) {
            console.error(err)
            setErrors({ general: 'Could not create ticket' })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <Field
                name="subject"
                className="form-control"
                placeholder="Brief summary"
              />
              <ErrorMessage name="subject" component="div" className="text-danger mt-1" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <Field
                as="textarea"
                name="description"
                className="form-control"
                rows="4"
                placeholder="Full details here"
              />
              <ErrorMessage name="description" component="div" className="text-danger mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="priority" className="form-label">Priority</label>
              <Field as="select" name="priority" className="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Ticket'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}