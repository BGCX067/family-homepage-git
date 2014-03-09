class WelcomeController < ApplicationController
  def index
  end
  
  def gallery
    file = "#{Rails.root}/data/gallery.yaml"
    @gallery = Gallery.new
    @gallery.load file
    render json: @gallery
  end
end
