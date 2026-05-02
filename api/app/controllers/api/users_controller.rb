module Api
  class UsersController < BaseController
    def me
      if current_user
        render json: { logged_in: true, user: { id: current_user.id, email: current_user.email }, csrf_token: form_authenticity_token }
      else
        render json: { logged_in: false, csrf_token: form_authenticity_token }
      end
    end
  end
end
