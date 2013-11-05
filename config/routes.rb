Sift::Application.routes.draw do

  root to: 'welcome#index'

  post '/login' => 'session#create'
  get '/logout' => 'session#destroy'

  resources :users do
    resources :ideas do
      resources :tags
    end
  end

end
