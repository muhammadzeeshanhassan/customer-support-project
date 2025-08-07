class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def render_not_found(exception = nil)
    respond_to do |format|
      format.html { render file: Rails.root.join("public/404.html"), status: :not_found, layout: false }
      format.json { render json: { error: "Not Found" }, status: :not_found }
    end
  end
end
