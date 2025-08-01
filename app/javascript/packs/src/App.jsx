// app/javascript/src/App.jsx
import React from 'react'
import LoginForm from './components/Auth/LoginForm'
import SignUpForm from './components/Auth/SignUpForm'
import AddTicketForm from './components/Tickets/AddTicketForm'
import HomePage from './components/Pages/HomePage'
import Dashboard from './components/Pages/Dashboard'
import EditTicketForm from './components/Tickets/EditTicketForm'

export default function App() {
  const container = document.getElementById('react-root')
  const page = container?.dataset.page
  const csrfToken = container?.dataset.csrfToken
  const role = container?.dataset.role
  const count = container?.dataset.count
  const ticketId = container?.dataset.ticketId

  switch (page) {
    case 'sign_in':
      return <LoginForm csrfToken={csrfToken} />
    case 'sign_up':
      return <SignUpForm csrfToken={csrfToken} />
    case 'add_ticket_form':
      return <AddTicketForm csrfToken={csrfToken} />
    case 'home_page':
      return <HomePage />
    case 'dashboard':
      return <Dashboard role={role} ticketCount={count} csrfToken={csrfToken} />
    case 'edit_ticket':
      return <EditTicketForm csrfToken={csrfToken} id={ticketId} role={role}/>
    default:
      return <div>Oops… nothing to render</div>
  }
}