Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  root "pages#home"
  devise_for :users, controllers: {
    registrations: "user/registrations",
    sessions:      "user/sessions"
  }

  resources :tickets do
    member do
      get :assign
      patch :assign_ticket
    end
  end

  get "/dashboard",  to: "dashboard#show"

  resources :agents, only: [ :index ]

  namespace :admin do
    resources :users
  end

  match "*unmatched", to: "errors#not_found", via: :all
end
