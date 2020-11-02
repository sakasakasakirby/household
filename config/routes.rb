Rails.application.routes.draw do
  devise_for :users
  resources :users, only: [:edit, :update]
  resources :lists, only: [:new, :create, :destroy]
  root "books#index"
  resources :books, only: [:index, :create, :show, :destroy, :update] do
    member do
      get "select_box"
      get "west_mountain"
    end
  end
  
  namespace :api do
    resources :books, only: :index, defaults: { format: 'json' }
  end

end
