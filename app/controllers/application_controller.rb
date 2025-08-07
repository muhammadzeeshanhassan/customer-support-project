class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name ])
  end
end
