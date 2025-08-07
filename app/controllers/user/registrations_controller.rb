class User::RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params)
    if resource.save
      UserNotificationWorker.perform_async(resource.id, "signup")
      render json: resource, status: :created
    else
      render json: { errors: resource.errors }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user)
          .permit(:name, :email, :role, :phone, :password, :password_confirmation)
  end
end
