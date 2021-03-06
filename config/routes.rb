FamilyHomepage::Application.routes.draw do

  get "about/index"
  post "activities/upload", to: "activities#upload"
  post "activities/undo_upload", to: "activities#undo_upload"
  get "get_activities", to: "activities#get_activities"
  resources :activities

  get "login" => "sessions#new", :as => "login"
  get "logout" => "sessions#destroy", :as => "logout"
  resources :sessions

  #get "sign_up" => "users#new", :as => "sign_up"
  #resources :users
  get "sign_up", to: "users#new", :as => "sign_up"
  resources :users

  get "family_tree", to: "family_tree#index"
  get "family_tree/members", to: "family_tree#members"

  get "welcome", to: "welcome#index"
  get "welcome/gallery", to: "welcome#gallery"

  root "welcome#index"

# The priority is based upon order of creation: first created -> highest priority.
# See how all your routes lay out with "rake routes".

# You can have the root of your site routed with "root"
# root 'welcome#index'

# Example of regular route:
#   get 'products/:id' => 'catalog#view'

# Example of named route that can be invoked with purchase_url(id: product.id)
#   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

# Example resource route (maps HTTP verbs to controller actions automatically):
#   resources :products

# Example resource route with options:
#   resources :products do
#     member do
#       get 'short'
#       post 'toggle'
#     end
#
#     collection do
#       get 'sold'
#     end
#   end

# Example resource route with sub-resources:
#   resources :products do
#     resources :comments, :sales
#     resource :seller
#   end

# Example resource route with more complex sub-resources:
#   resources :products do
#     resources :comments
#     resources :sales do
#       get 'recent', on: :collection
#     end
#   end

# Example resource route with concerns:
#   concern :toggleable do
#     post 'toggle'
#   end
#   resources :posts, concerns: :toggleable
#   resources :photos, concerns: :toggleable

# Example resource route within a namespace:
#   namespace :admin do
#     # Directs /admin/products/* to Admin::ProductsController
#     # (app/controllers/admin/products_controller.rb)
#     resources :products
#   end
end
