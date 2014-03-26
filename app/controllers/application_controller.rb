class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_locale

  before_filter :set_navigation_tabs

  private
  
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def set_navigation_tabs
    @tabs =
    if current_user && manager?
      [
        { :name => "Home", :icon => "icon-home", :path => home_index_path },
        { :name => "Portfolio", :icon => "icon-camera", :path => portfolio_home_index_path },
        { :name => "Contact", :icon => "icon-envelope-alt", :path => contact_home_index_path }
      ]
    elsif current_user && client?
    end
  end
end
