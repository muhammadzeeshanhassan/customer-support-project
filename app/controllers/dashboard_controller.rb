class DashboardController < ApplicationController
  before_action :authenticate_user!


  def show
    @tickets = case current_user.role
    when "customer"
      current_user.tickets
    when "agent"
      current_user.assigned_tickets
    when "admin"
      Ticket.all
    else
      Ticket.none
    end
  end
end
