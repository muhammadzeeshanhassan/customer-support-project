class ErrorsController < ApplicationController
  skip_before_action :authenticate_user!, raise: false

  def not_found
    respond_to do |format|
      format.html do
        render file: Rails.root.join("public/404.html"), status: :not_found, layout: false
      end
      format.json do
        render json: { error: "Not Found" }, status: :not_found
      end
    end
  end
end
