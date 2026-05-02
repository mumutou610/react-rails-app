module Api
  class MealsController < BaseController
    before_action :require_login
    before_action :set_meal, only: [ :show, :update, :destroy ]

    def index
      render json: current_user.meals.order(eaten_at: :desc)
    end

    def show
      render json: @meal
    end

    def create
      meal = current_user.meals.build(meal_params)
      if meal.save
        render json: meal, status: :created
      else
        render json: { errors: meal.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @meal.update(meal_params)
        render json: @meal
      else
        render json: { errors: @meal.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @meal.destroy
      head :no_content
    end

    private

    def require_login
      unless current_user
        render json: { error: "ログインが必要です" }, status: :unauthorized
      end
    end

    def set_meal
      @meal = current_user.meals.find(params[:id])
    end

    def meal_params
      params.require(:meal).permit(:description, :eaten_at, :memo, :ai_feedback)
    end
  end
end
