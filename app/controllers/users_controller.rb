class UsersController < ApplicationController
  respond_to :json

  def create
    @user = User.create params[:user]
    respond_with @user
  end

end
