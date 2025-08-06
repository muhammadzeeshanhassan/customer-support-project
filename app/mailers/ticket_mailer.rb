class TicketMailer < ApplicationMailer

  def notify_admins_of_new_ticket(ticket)
    @ticket = ticket
    admin_email = User.where(role: :admin).pluck(:email)
    mail(to: admin_email, subject: "[New Ticket ##{ticket.id}] #{ticket.subject}")
  end

  def notify_agent_of_assignment(ticket)
    @ticket = ticket
    @agent  = ticket.agent
    mail(to: ticket.agent.email, subject: "You've been assigned Ticket ##{ticket.id}")
  end

  def notify_customer_of_status_change(ticket)
    @ticket = ticket
    @customer = ticket.customer
    mail(to: ticket.customer.email,
    subject: "Your Ticket ##{ticket.id} status is now “#{ticket.status}”")
  end
end
