class SessionController < ApplicationController

  respond_to :json

  def create
    @user = User.where(email: params[:email]).first
    if @user
      if @user.authenticate params[:password]
        flash[:notice] = "You have successfully logged in #{@user.email}! "
        session[:user_id] = @user.id
        respond_with # TODO create session
      else
        flash[:error] = "Unfortunately you typed in the wrong password..."
        respond_with #TODO flash error
      end
    else
      flash[:error] = "Unfortunately, the email #{params[:email]} does not exist"

      respond_with # TODO flash error
    end
  end

  def destroy
    flash[:notice] = "You have successfully logged out."
    session[:user_id] = nil
    respond_with # TODO destroy session
  end

end
