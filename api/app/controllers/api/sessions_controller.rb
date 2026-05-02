module Api
  class SessionsController < BaseController
    def create
      user = User.find_by(email: params.dig(:user, :email))
      if user&.valid_password?(params.dig(:user, :password))
        sign_in user
        render json: { logged_in: true, user: { id: user.id, email: user.email }, csrf_token: form_authenticity_token }
      else
        render json: { errors: ['メールアドレスまたはパスワードが違います'] }, status: :unauthorized
      end
    end

    def destroy
      sign_out current_user
      render json: { logged_in: false, csrf_token: form_authenticity_token }
    end
  end
end
