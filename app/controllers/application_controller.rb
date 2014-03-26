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
    @tabs = [
        { :name => t('menu_home'), :path => welcome_path },
        { :name => t('menu_family_tree'), :path => family_tree_path },
        { :name => t('menu_timeline'), :path => '#'},
        { :name => t('menu_blog'), :path => '#'},
        { :name => t('menu_about'), :path => '#'}
      ]
    #if current_user && manager?
    #elsif current_user && client?
    #end
  end
end
