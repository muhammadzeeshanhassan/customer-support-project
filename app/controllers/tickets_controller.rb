class TicketsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_ticket, only: [ :show, :edit, :update, :destroy, :assign, :assign_ticket ]

  def index
    page = params.fetch(:page,    1).to_i
    per_page = params.fetch(:per_page, 10).to_i

    tickets = Ticket.visible_to(current_user).order(created_at: :desc).page(page).per(per_page)

    render json: {
      tickets: tickets,
      meta: {
        current_page: tickets.current_page,
        total_pages:  tickets.total_pages,
        total_count:  tickets.total_count
      }
    }, status: :ok
  end

  def show
    respond_to do |format|
      format.html
      format.json do
        render json: @ticket, include: {
          customer: { only: [ :id, :name, :email ] },
          agent:    { only: [ :id, :name, :email ] }
        }
      end
    end
  end

  def new; end

  def create
    @ticket = current_user.tickets.build(ticket_params)
    if @ticket.save
      TicketNotificationWorker.perform_async(@ticket.id, "new_ticket")
      render json: @ticket, status: :created
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @ticket.update(ticket_params)
      render json: @ticket, status: :ok
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @ticket.destroy
    head :no_content
  end

  def assign; end

  def assign_ticket
    if @ticket.update(agent_id: params.dig(:ticket, :agent_id))
      TicketNotificationWorker.perform_async(@ticket.id, "assignment")
      render json: @ticket, status: :ok
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_ticket
    @ticket = Ticket.visible_to(current_user).find_by(id: params[:id])

    unless @ticket
      respond_to do |format|
        format.html do
          render file: Rails.root.join("public/404.html"),
                 status: :not_found,
                 layout: false
        end
        format.json do
          render json: { error: "Not Found" },
                 status: :not_found
        end
      end
      nil
    end
  end

  def ticket_params
    params.require(:ticket)
          .permit(:subject, :description, :priority, :agent_id, :status)
  end
end
