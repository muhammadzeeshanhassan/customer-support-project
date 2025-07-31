// app/javascript/src/App.jsx
import React from 'react'
import LoginForm from './components/Auth/LoginForm'
import SignUpForm from './components/Auth/SignUpForm'
import AddTicketForm from './components/Tickets/AddTicketForm'
import HomePage from './components/Pages/HomePage'

export default function App() {
  const container = document.getElementById('react-root')
  const page = container?.dataset.page
  const csrfToken = container?.dataset.csrfToken

  switch (page) {
    case 'sign_in':
      return <LoginForm csrfToken={csrfToken} />
    case 'sign_up':
      return <SignUpForm csrfToken={csrfToken} />
    case 'add_ticket_form':
      return <AddTicketForm csrfToken={csrfToken} />
    case 'home_page':
      return <HomePage />
    default:
      return <div>Oops… nothing to render</div>
  }
}