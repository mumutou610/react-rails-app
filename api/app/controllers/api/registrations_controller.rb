module Api
  class RegistrationsController < BaseController
    def create
      user = User.new(
        email: params.dig(:user, :email),
        password: params.dig(:user, :password),
        password_confirmation: params.dig(:user, :password_confirmation)
      )
      if user.save
        sign_in user
        render json: { logged_in: true, user: { id: user.id, email: user.email }, csrf_token: form_authenticity_token }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
