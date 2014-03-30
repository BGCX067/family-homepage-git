class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_locale
  before_action :set_navigation_tabs
  # before_action :session_expires, :only => [:login, :logout]
  # before_action :update_session_time, :except => [:login, :logout]

  private

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def set_navigation_tabs
    @tabs = [
      { :name => t('menu.home'), :path => welcome_path },
      { :name => t('menu.family_tree'), :path => family_tree_path },
      { :name => t('menu.life'), :path => '#'},
      { :name => t('menu.blog'), :path => '#'},
      { :name => t('menu.about'), :path => '#'}
    ]

    # only have built-in admin users, others cannot sign up
    if current_user
      @admin_tabs = [
        { :name => t('menu.admin.logout'), :path => logout_path },
        { :name => t('menu.admin.activity'), :path => new_activity_path }
      ]
    end
  end

  def current_user
    return unless session[:user_id]
    @current_user ||= User.find(session[:user_id])
  end
  
  # def session_expires
    # @time_left = session[:expires_at].nil? ? 0 : (session[:expires_at] - Time.now).to_i
    # unless @time_left > 0
      # reset_session
      # # redirect_to :controller => 'welcome', :action => 'index'
      # redirect_to welcome_path
    # end
  # end
# 
  # def update_session_time
    # session[:expires_at] = Time.now + 1.hour
  # end
end
