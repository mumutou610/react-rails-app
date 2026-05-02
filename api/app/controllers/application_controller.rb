class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  def after_sign_in_path_for(_resource)
    ENV.fetch("FRONTEND_URL", "http://localhost:5173") + "/meals"
  end

  def after_sign_out_path_for(_resource_or_scope)
    ENV.fetch("FRONTEND_URL", "http://localhost:5173") + "/"
  end
end
