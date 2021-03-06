class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.authenticate(params[:email], params[:password])
    if user
      reset_session
      session[:user_id] = user.id
      redirect_to root_url#, :notice => "Logged in!"
    else
      flash.now.alert = "Invalid email or password"
      render "new"
    end
  end
  
  def destroy
    #session[:user_id] = nil
    reset_session
    #redirect_to root_url#, :notice => "logged out!"
    redirect_to login_path
  end
  
end
