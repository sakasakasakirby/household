Rails.application.routes.draw do
  devise_for :users
  root "books#index"
  resources :books, only: [:index, :create, :show, :destroy]
  resources :users, only: [:edit, :update]

  namespace :api do
    resources :books, only: :index, defaults: { format: 'json' }
  end
end
