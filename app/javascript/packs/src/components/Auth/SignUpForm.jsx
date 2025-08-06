import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function SignUpForm({ csrfToken }) {
  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Create an Account</h2>

      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          password: '',
          password_confirmation: ''
        }}
        validate={values => {
          const errors = {}
          if (!values.name) errors.name = 'Required'
          if (!values.email) errors.email = 'Required'
          if (!values.password) errors.password = 'Required'
          if (values.password !== values.password_confirmation) {
            errors.password_confirmation = 'Passwords must match'
          }
          return errors
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await axios.post(
              '/users',
              { user: values },
              {
                headers: {
                  'X-CSRF-Token': csrfToken,
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              }
            )
            window.location.href = '/'
          } catch (err) {
            console.error(err)
            setErrors({ general: 'Could not create user' })
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
              <label htmlFor="name" className="form-label">Name</label>
              <Field
                name="name"
                type="text"
                className="form-control"
                placeholder="Your full name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger mt-1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field
                name="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger mt-1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <Field
                name="phone"
                type="text"
                className="form-control"
                placeholder="03001111111"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger mt-1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field
                name="password"
                type="password"
                className="form-control"
                placeholder="******"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger mt-1"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <Field
                name="password_confirmation"
                type="password"
                className="form-control"
                placeholder="******"
              />
              <ErrorMessage
                name="password_confirmation"
                component="div"
                className="text-danger mt-1"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up…' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
