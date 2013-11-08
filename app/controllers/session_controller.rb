class SessionController < ApplicationController

  respond_to :json

  def create
    @user = User.where(email: params[:email]).first
    if @user
      if @user.authenticate params[:password]
        session[:user_id] = @user.id
        session[:email] = @user.email
        render json: session
      else
        error = { error: 'Incorrect Password' }
        render json: error
      end
    else
      error = { error: "Unfortunately, the email #{params[:email]} does not exist" }
      render json: error
    end
  end

  def destroy
    session[:user_id] = nil
    respond_with session
  end

end
