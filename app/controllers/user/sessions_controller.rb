# # frozen_string_literal: true

# class User::SessionsController < Devise::SessionsController
#   # before_action :configure_sign_in_params, only: [:create]

#   # GET /resource/sign_in
#   # def new
#   #   super
#   # end

#   # POST /resource/sign_in
#   # def create
#   #   super
#   # end

#   # DELETE /resource/sign_out
#   # def destroy
#   #   super
#   # end

#   # protected

#   # If you have extra params to permit, append them to the sanitizer.
#   # def configure_sign_in_params
#   #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
#   # end
# end


# app/controllers/users/sessions_controller.rb
class User::SessionsController < Devise::SessionsController
  # Allow JSON POSTs without a CSRF exception
  protect_from_forgery with: :null_session

  # Only respond to JSON
  respond_to :json

  # POST /users/sign_in
  def create
    # 1. Find & authenticate the user via Warden
    self.resource = warden.authenticate!(auth_options)
    # 2. Sign them in (sets the session cookie)
    sign_in(resource_name, resource)
    # 3. Return the user as JSON (200 OK)
    render json: { user: resource }, status: :ok
  end

  # DELETE /users/sign_out
  def destroy
    # Signs the user out (clears the session)
    sign_out(resource_name)
    # Return 204 No Content
    head :no_content
  end
end
