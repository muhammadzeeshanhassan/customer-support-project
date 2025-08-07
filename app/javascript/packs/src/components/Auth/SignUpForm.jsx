import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function SignUpForm({ csrfToken, defaultRole = 'customer' }) {
  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Create an Account</h2>

      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          password: '',
          password_confirmation: '',
          role: defaultRole
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
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': csrfToken
                },
                withCredentials: true
              }
            )
            window.location.href = '/'
          } catch (err) {
            const data = err.response?.data
            if (data?.error) {
              setErrors({ general: data.error })
            }
            else if (Array.isArray(data?.errors)) {
              setErrors({ general: data.errors.join(' — ') })
            }
            else if (data?.errors && typeof data.errors === 'object') {
              const fieldErrors = {}
              for (const [field, msgs] of Object.entries(data.errors)) {
                fieldErrors[field] = Array.isArray(msgs) ? msgs.join(' ') : msgs
              }
              setErrors(fieldErrors)
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

            {[
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone', type: 'text' }
            ].map(({ name, label, type }) => (
              <div className="mb-3 position-relative" key={name}>
                <label htmlFor={name} className="form-label">
                  {label}
                </label>
                <Field
                  id={name}
                  name={name}
                  type={type}
                  className={`form-control${touched[name] && errors[name] ? ' is-invalid' : ''
                    }`}
                  placeholder={
                    name === 'phone' ? '0300xxxxxxx' : undefined
                  }
                />
                <ErrorMessage name={name}>
                  {msg => <div className="invalid-feedback">{msg}</div>}
                </ErrorMessage>
              </div>
            ))}

            <div className="mb-3 position-relative">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <Field
                as="select"
                id="role"
                name="role"
                className="form-select"
              >
                <option value="customer">Customer</option>
              </Field>
            </div>


            {[
              { name: 'password', label: 'Password', type: 'password' },
              {
                name: 'password_confirmation',
                label: 'Confirm Password',
                type: 'password'
              }
            ].map(({ name, label, type }) => (
              <div className="mb-3 position-relative" key={name}>
                <label htmlFor={name} className="form-label">
                  {label}
                </label>
                <Field
                  id={name}
                  name={name}
                  type={type}
                  className={`form-control${touched[name] && errors[name] ? ' is-invalid' : ''
                    }`}
                />
                <ErrorMessage name={name}>
                  {msg => <div className="invalid-feedback">{msg}</div>}
                </ErrorMessage>
              </div>
            ))}

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