import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios/dist/axios.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function EditTicketForm({ id, csrfToken, role }) {
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log(role);

    useEffect(() => {
        axios.get(
            `/tickets/${id}`,
            {
                headers: { Accept: 'application/json' },
                withCredentials: true
            }
        )
            .then(resp => setTicket(resp.data))
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
                    if (!values.subject) errors.subject = 'Required'
                    if (!values.description) errors.description = 'Required'
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
                        // redirect back to the ticket show page
                        window.location.href = `/tickets/${id}`
                    } catch (err) {
                        console.error(err)
                        setErrors({ general: 'Could not edit ticket' })
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
                                type="text"
                                className="form-control"
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
                            />
                            <ErrorMessage name="description" component="div" className="text-danger mt-1" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <Field as="select" name="priority" className="form-select">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Field>
                        </div>

                        {role == 'admin' && (
                            <div className="mb-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <Field as="select" name="status" className="form-select">
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
                    </Form>
                )}
            </Formik>
        </div>
    )
}

