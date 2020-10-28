Rails.application.routes.draw do
  devise_for :users
  resources :users, only: [:edit, :update]
  root "books#index"
  resources :books, only: [:index, :create, :show, :destroy] do
    member do
      get "west_mountain"
    end
  end
  
  namespace :api do
    resources :books, only: :index, defaults: { format: 'json' }
  end

end
