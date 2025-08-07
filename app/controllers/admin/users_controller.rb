class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!

  def new; end

  def create
    @user = User.new(user_params)
    if @user.save
      UserNotificationWorker.perform_async(@user.id, "signup")
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user)
          .permit(:name, :email, :phone, :role, :password, :password_confirmation)
  end

  def authorize_admin!
    head :forbidden unless current_user.admin?
  end
end
