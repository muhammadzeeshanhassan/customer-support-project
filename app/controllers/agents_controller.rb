class AgentsController < ApplicationController
  before_action :authenticate_user!
  def index
    agents = User.agent.select(:id, :name, :email)
    render json: agents, status: :ok
  end
end
