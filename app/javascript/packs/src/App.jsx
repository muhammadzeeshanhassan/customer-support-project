import React from 'react'
import LoginForm from './components/Auth/LoginForm'
import SignUpForm from './components/Auth/SignUpForm'
import AddTicketForm from './components/Tickets/AddTicketForm'
import HomePage from './components/Pages/HomePage'
import Dashboard from './components/Pages/Dashboard'
import EditTicketForm from './components/Tickets/EditTicketForm'
import AssignTicketForm from './components/Tickets/AssignTicketForm'
import ViewTicket from './components/Tickets/ViewTicket'
import AddUserForm from './components/Auth/AddUserForm'

export default function App() {
  const container = document.getElementById('react-root')
  const page = container?.dataset.page
  const csrfToken = container?.dataset.csrfToken
  const role = container?.dataset.role
  const count = container?.dataset.count
  const ticketId = container?.dataset.ticketId
  const userName = container?.dataset.userName
  const signedInStr = container?.dataset.signedIn
  const signedIn = signedInStr === "true"

  switch (page) {
    case 'sign_in':
      return <LoginForm csrfToken={csrfToken} />
    case 'sign_up':
      return <SignUpForm csrfToken={csrfToken} />
    case 'add_ticket_form':
      return <AddTicketForm csrfToken={csrfToken} />
    case 'home_page':
      return <HomePage role={role} signedIn={signedIn} />
    case 'dashboard':
      return <Dashboard role={role} csrfToken={csrfToken} userName={userName} />
    case 'edit_ticket':
      return <EditTicketForm csrfToken={csrfToken} id={ticketId} role={role} />
    case 'assign_ticket':
      return <AssignTicketForm csrfToken={csrfToken} role={role} ticketId={ticketId} />
    case 'view_ticket':
      return <ViewTicket id={ticketId} csrfToken={csrfToken} role={role} />
    case 'add_user':
      return <AddUserForm csrfToken={csrfToken} />
    default:
      return <div>Nothing to render</div>
  }
}