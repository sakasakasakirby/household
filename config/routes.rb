Rails.application.routes.draw do
  root "books#index"
  resources :books, only: [:index, :create]

  namespace :api do
    resources :books, only: :index, defaults: { format: 'json' }
  end
end
