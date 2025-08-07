import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function EditTicketForm({ id, csrfToken, role }) {
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`/tickets/${id}`, {
            headers: { Accept: 'application/json' },
            withCredentials: true
        })
            .then(r => setTicket(r.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p>Loading…</p>
    if (!ticket) return <p>Ticket not found</p>

    return (
        <div className="container py-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Edit Ticket #{ticket.id}</h2>
            <Formik
                initialValues={{
                    subject: ticket.subject,
                    description: ticket.description,
                    priority: ticket.priority,
                    status: ticket.status
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
                        await axios.patch(
                            `/tickets/${id}`,
                            { ticket: values },
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
                        const data = err.response?.data
                        if (data?.error) {
                            setErrors({ general: data.error })
                        } else if (Array.isArray(data?.errors)) {
                            setErrors({ general: data.errors.join(' — ') })
                        } else if (data?.errors && typeof data.errors === 'object') {
                            const fieldErr = {}
                            Object.entries(data.errors).forEach(([f, msgs]) => {
                                fieldErr[f] = Array.isArray(msgs) ? msgs.join(' ') : msgs
                            })
                            setErrors(fieldErr)
                        } else {
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
                            />
                            <ErrorMessage name="description">
                                {msg => <div className="invalid-feedback">{msg}</div>}
                            </ErrorMessage>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <Field as="select" id="priority" name="priority" className="form-select">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Field>
                        </div>

                        {(role === 'admin' || role === 'agent') && (
                            <div className="mb-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <Field as="select" id="status" name="status" className="form-select">
                                    <option value="open">Open</option>
                                    <option value="pending">Pending</option>
                                    <option value="closed">Closed</option>
                                </Field>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating…' : 'Update Ticket'}
                        </button>

                        <div className="d-flex justify-content-between mt-3">
                            <Link to="/dashboard">Dashboard</Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
