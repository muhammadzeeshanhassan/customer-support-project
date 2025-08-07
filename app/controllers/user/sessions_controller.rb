class User::SessionsController < Devise::SessionsController
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    render json: { user: resource }, status: :ok
  end

  def destroy
    sign_out(resource_name)
    head :no_content
  end
end
