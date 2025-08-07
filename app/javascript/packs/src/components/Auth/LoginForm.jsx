import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function LoginForm({ csrfToken }) {
  return (
    <div className="container mt-5 justify-center" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Login To Your Account</h2>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validate={values => {
          const errors = {}
          if (!values.email) errors.email = 'Required'
          if (!values.password) errors.password = 'Required'
          return errors
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await axios.post(
              '/users/sign_in',
              { user: values },
              {
                headers: {
                  'Accept': 'application/json',
                  'X-CSRF-Token': csrfToken,
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              }
            )
            window.location.href = '/'
          } catch (err) {
            console.error(err)
            const response = err.response?.data
            const message =
              response?.error ||
              (Array.isArray(response?.errors) && response.errors.join(' - ')) ||
              err.message

            setErrors({ general: message })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form noValidate>
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`form-control${touched.email && errors.email ? ' is-invalid' : ''
                  }`}
              />
              <ErrorMessage name="email">
                {msg => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="******"
                className={`form-control${touched.password && errors.password ? ' is-invalid' : ''
                  }`}
              />
              <ErrorMessage name="password">
                {msg => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4 p-3 border rounded bg-light">
        <h5 className="mb-2">Demo Credentials</h5>
        <ul className="list-unstyled mb-0">
          <li><strong>Customer</strong> - <code>mzeeshanhassan125@gmail.com</code> / <code>123456</code></li>
          <li><strong>Agent</strong>    - <code>hamza167167@gmail.com</code> / <code>123456</code></li>
          <li><strong>Admin</strong>    - <code>muhammad.zeeshan@devsinc.com</code> / <code>123456</code></li>
        </ul>
      </div>
    </div >
  )
}
