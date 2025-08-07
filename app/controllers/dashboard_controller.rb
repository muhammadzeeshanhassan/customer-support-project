class DashboardController < ApplicationController
  before_action :authenticate_user!
  def show
    @tickets = Ticket.visible_to(current_user)
  end
end
