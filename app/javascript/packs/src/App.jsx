// import React from 'react'
// import LoginForm from './components/Auth/LoginForm'
// import SignUpForm from './components/Auth/SignUpForm'
// import AddTicketForm from './components/Tickets/AddTicketForm'
// import HomePage from './components/Pages/HomePage'
// import Dashboard from './components/Pages/Dashboard'
// import EditTicketForm from './components/Tickets/EditTicketForm'
// import AssignTicketForm from './components/Tickets/AssignTicketForm'
// import ViewTicket from './components/Tickets/ViewTicket'
// import AddUserForm from './components/Auth/AddUserForm'

// export default function App() {
//   const container = document.getElementById('react-root')
//   const page = container?.dataset.page
//   const csrfToken = container?.dataset.csrfToken
//   const role = container?.dataset.role
//   const count = container?.dataset.count
//   const ticketId = container?.dataset.ticketId
//   const userName = container?.dataset.userName
//   const signedInStr = container?.dataset.signedIn
//   const signedIn = signedInStr === "true"

//   switch (page) {
//     case 'sign_in':
//       return <LoginForm csrfToken={csrfToken} />
//     case 'sign_up':
//       return <SignUpForm csrfToken={csrfToken} />
//     case 'add_ticket_form':
//       return <AddTicketForm csrfToken={csrfToken} />
//     case 'home_page':
//       return <HomePage role={role} signedIn={signedIn} />
//     case 'dashboard':
//       return <Dashboard role={role} csrfToken={csrfToken} userName={userName} />
//     case 'edit_ticket':
//       return <EditTicketForm csrfToken={csrfToken} id={ticketId} role={role} />
//     case 'assign_ticket':
//       return <AssignTicketForm csrfToken={csrfToken} role={role} ticketId={ticketId} />
//     case 'view_ticket':
//       return <ViewTicket id={ticketId} csrfToken={csrfToken} role={role} />
//     case 'add_user':
//       return <AddUserForm csrfToken={csrfToken} />
//     default:
//       return <div>Nothing to render</div>
//   }
// }

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
  // const page = container?.dataset.page
  const csrfToken = container?.dataset.csrfToken
  const role = container?.dataset.role
  // const count = container?.dataset.count
  const ticketId = container?.dataset.ticketId
  const userName = container?.dataset.userName
  const signedInStr = container?.dataset.signedIn
  const signedIn = signedInStr === "true"
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage role={role} signedIn={signedIn} />} />
        <Route path="/users/sign_in" element={<LoginForm csrfToken={csrfToken} />} />
        <Route path="/users/sign_up" element={<SignUpForm csrfToken={csrfToken} />} />
        <Route path="/dashboard" element={<Dashboard role={role} csrfToken={csrfToken} userName={userName} />} />
        <Route path="/tickets/new" element={<AddTicketForm csrfToken={csrfToken} />} />
        <Route path="/tickets/:id" element={<ViewTicket csrfToken={csrfToken} id={ticketId} />} />
        <Route path="/tickets/:id/edit" element={<EditTicketForm csrfToken={csrfToken} role={role} id={ticketId} />} />
        <Route path="/tickets/:id/assign" element={<AssignTicketForm csrfToken={csrfToken} id={ticketId} />} />
        <Route path="/admin/users/new" element={<AddUserForm csrfToken={csrfToken} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}