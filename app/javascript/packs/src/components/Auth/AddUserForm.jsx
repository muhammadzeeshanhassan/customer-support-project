import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'

export default function AddUserForm({ csrfToken }) {
    return (
        <div className="container mt-5" style={{ maxWidth: '480px' }}>
            <h2 className="mb-4 text-center">Add Admin / Agent</h2>

            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    role: 'agent',
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
                            '/admin/users',
                            { user: values },
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
                        const resp = err.response?.data
                        setErrors({ general: resp?.errors?.join(' ') || 'Failed to create' })
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

                        {[
                            { name: 'name', label: 'Name', type: 'text' },
                            { name: 'email', label: 'Email', type: 'email' },
                            { name: 'phone', label: 'Phone', type: 'text' }
                        ].map(({ name, label, type }) => (
                            <div className="mb-3" key={name}>
                                <label className="form-label">{label}</label>
                                <Field name={name} type={type} className="form-control" />
                                <ErrorMessage name={name} component="div" className="text-danger mt-1" />
                            </div>
                        ))}

                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <Field as="select" name="role" className="form-select">
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                            </Field>
                        </div>

                        {[
                            { name: 'password', label: 'Password', type: 'password' },
                            { name: 'password_confirmation', label: 'Confirm Password', type: 'password' }
                        ].map(({ name, label, type }) => (
                            <div className="mb-3" key={name}>
                                <label className="form-label">{label}</label>
                                <Field name={name} type={type} className="form-control" />
                                <ErrorMessage name={name} component="div" className="text-danger mt-1" />
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding…' : 'Add User'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}