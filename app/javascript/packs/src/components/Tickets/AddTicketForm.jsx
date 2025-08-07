import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function AddTicketForm({ csrfToken }) {
  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Create a Ticket</h2>

      <div className="mb-4">
        <a href="/" className="btn btn-secondary">
          Back to Home
        </a>
      </div>

      <Formik
        initialValues={{
          subject: '',
          description: '',
          priority: 'low'
        }}
        validate={values => {
          const errors = {}

          if (!values.subject) {
            errors.subject = 'Required'
          } else if (values.subject.length < 15) {
            errors.subject = 'Subject must be at least 15 characters'
          } else if (values.subject.length > 100) {
            errors.subject = 'Subject must be fewer than 100 characters'
          }

          if (!values.description) {
            errors.description = 'Required'
          } else if (values.description.length < 50) {
            errors.description = 'Description must be at least 50 characters'
          } else if (values.description.length > 300) {
            errors.description = 'Description must be fewer than 300 characters'
          }

          return errors
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await axios.post(
              '/tickets',
              { ticket: values },
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': csrfToken
                },
                withCredentials: true
              }
            )
            window.location.href = '/dashboard'
          } catch (err) {
            const data = err.response?.data
            if (data?.error) {
              setErrors({ general: data.error })
            }
            else if (Array.isArray(data?.errors)) {
              setErrors({ general: data.errors.join(' — ') })
            }
            else if (data?.errors && typeof data.errors === 'object') {
              const fieldErr = {}
              Object.entries(data.errors).forEach(([field, msgs]) => {
                fieldErr[field] = Array.isArray(msgs) ? msgs.join(' ') : msgs
              })
              setErrors(fieldErr)
            }
            else {
              setErrors({ general: err.message })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form noValidate>
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            <div className="mb-3 position-relative">
              <label htmlFor="subject" className="form-label">Subject</label>
              <Field
                id="subject"
                name="subject"
                className={`form-control${touched.subject && errors.subject ? ' is-invalid' : ''}`}
                placeholder="Brief summary (15-100 chars)"
              />
              <ErrorMessage name="subject">
                {msg => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="description" className="form-label">Description</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="4"
                className={`form-control${touched.description && errors.description ? ' is-invalid' : ''}`}
                placeholder="Full details (50-300 chars)"
              />
              <ErrorMessage name="description">
                {msg => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-4">
              <label htmlFor="priority" className="form-label">Priority</label>
              <Field
                as="select"
                id="priority"
                name="priority"
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating…' : 'Create Ticket'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}