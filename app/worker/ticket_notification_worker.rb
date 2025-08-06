class TicketNotificationWorker
  include Sidekiq::Worker
  sidekiq_options retry: 2

  def perform(ticket_id, type)
    ticket = Ticket.find(ticket_id)
    case type
    when 'new_ticket'
      TicketMailer.notify_admins_of_new_ticket(ticket).deliver_now
    when 'assignment'
      TicketMailer.notify_agent_of_assignment(ticket).deliver_now
    end
  end
end
