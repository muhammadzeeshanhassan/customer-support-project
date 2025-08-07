// src/components/LoginForm.jsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm({ csrfToken }) {
  const { login } = useAuth(csrfToken);

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Login To Your Account</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email) errors.email = 'Required';
          if (!values.password) errors.password = 'Required';
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await login(values);
            window.location.href = '/';
          } catch (error) {
            setErrors({ general: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form noValidate>
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`form-control${touched.email && errors.email ? ' is-invalid' : ''}`}
              />
              <ErrorMessage name="email">
                {(msg) => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="******"
                className={`form-control${touched.password && errors.password ? ' is-invalid' : ''}`}
              />
              <ErrorMessage name="password">
                {(msg) => <div className="invalid-feedback">{msg}</div>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>

            <div className="d-flex justify-content-between mt-3">
              <a href="/">Home</a>
              <a href="/users/sign_up">Sign Up</a>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-4 p-3 border rounded bg-light">
        <h5 className="mb-2">Demo Credentials</h5>
        <ul className="list-unstyled mb-0">
          <li>
            <strong>Customer</strong> — <code>mzeeshanhassan125@gmail.com</code> / <code>123456</code>
          </li>
          <li>
            <strong>Agent</strong> — <code>hamza167167@gmail.com</code> / <code>123456</code>
          </li>
          <li>
            <strong>Admin</strong> — <code>muhammad.zeeshan@devsinc.com</code> / <code>123456</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
