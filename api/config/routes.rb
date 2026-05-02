Rails.application.routes.draw do
  devise_for :users, skip: :all

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post   'login',  to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'
    post   'signup', to: 'registrations#create'
    get    'me',     to: 'users#me'
    resources :meals
  end
end
