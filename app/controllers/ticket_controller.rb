class TicketController < ApplicationController
  before_action :authenticate_user!
  before_action :set_ticket, only: [:show, :edit, :update, :destroy, :assign_ticket, :assign] 

  def assign_ticket
    if @ticket.update(agent_id: params.dig(:ticket, :agent_id))
      render json: @ticket, status: :ok
      TicketMailer.notify_agent_of_assignment(@ticket).deliver_later
    else
      render json: {errors: @ticket.errors}, status: :unprocessable_entity
    end
  end

  def assign
  end

  def index
    @tickets = if current_user.admin?
      Ticket.all
    elsif current_user.agent?
      current_user.assigned_tickets
    else
      current_user.tickets
    end

    page     = params.fetch(:page, 1).to_i
    per_page = params.fetch(:per_page, 10).to_i

    tickets = @tickets.order(created_at: :desc).page(page).per(per_page)

    render json: {
      tickets: tickets,
      meta: {
        current_page: tickets.current_page,
        total_pages:  tickets.total_pages,
        total_count:  tickets.total_count
      }
    },  status: :ok
  end

  def new
  end

  def create
    @ticket = current_user.tickets.build(ticket_params)
    if @ticket.save
      render json: @ticket, status: :created
      TicketMailer.notify_admins_of_new_ticket(@ticket).deliver_later
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def show
    render json: @ticket, status: :ok
    # respond_to do |format|
    # format.html  # renders app/views/ticket/show.html.erb → your React Mount
    # format.json { render json: @ticket }
    #  end
  end

  def edit
  end

  def update
    if @ticket.update(ticket_params)
      render json: @ticket, status: :ok
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @ticket.destroy
  end

  private

  def set_ticket
    @ticket = Ticket.find(params[:id])
  end

  def ticket_params
    params.require(:ticket)
          .permit(:subject, :description, :priority, :agent_id, :status)
  end
end