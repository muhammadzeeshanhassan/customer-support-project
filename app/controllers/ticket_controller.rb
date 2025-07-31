class TicketController < ApplicationController
  before_action :authenticate_user!
  before_action :set_ticket, only: [:show, :edit, :update, :destroy]
  before_action :authorize_admin!, only: [:edit, :update, :destroy] 

  def index
    @tickets = if current_user.admin?
      Ticket.all
    elsif current_user.agent?
      current_user.assigned_tickets
    else
      current_user.tickets
    end

    render json: @tickets, status: :ok
  end

  def new
    # renders app/views/tickets/new.html.erb
  end

  def create
    @ticket = current_user.tickets.build(ticket_params)
    if @ticket.save
      render json: @ticket, status: :created
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def show
    render json: @ticket, status: :ok
  end

  def edit
  end

  def update
    # if @ticket.update(ticket_params)
    #   render json: @ticket, status: :ok
    # else
    #   render json: { errors: @ticket.errors }, status: :unprocessable_entity
    # end
  end

  def destroy
    # @ticket.destroy
    # head :no_content
  end

  private

  def set_ticket
    @ticket = Ticket.find(params[:id])
  end

  def ticket_params
    params.require(:ticket)
          .permit(:subject, :description, :priority, :agent_id, :status)
  end

  # def authorize_admin!
  #   head :forbidden unless current_user.admin?
  # end
end