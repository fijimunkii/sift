class IdeasController < ApplicationController
  respond_to :json

  def index
    @ideas = Idea.where(user_id: params[:user_id])
    respond_with @ideas
  end

  def create
    binding.pry
    @idea = Idea.create params[:idea]
    render json: @idea
  end

  def view
    @idea.find params[:id]
    respond_with @idea
  end

  def destroy
    @idea.find(params[:id]).destroy
    the_response = 'boom'
    respond_with the_response
  end

end
