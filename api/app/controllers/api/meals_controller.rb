module Api
  class MealsController < ApplicationController
    before_action :set_meal, only: [ :show, :update, :destroy ]

    def index
      meals = Meal.order(eaten_at: :desc)
      render json: meals
    end

    def show
      render json: @meal
    end

    def create
      meal = Meal.new(meal_params)
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

    def set_meal
      @meal = Meal.find(params[:id])
    end

    def meal_params
      params.require(:meal).permit(:description, :eaten_at, :memo, :ai_feedback)
    end
  end
end
