class UsersController < ApplicationController

  def edit
    @name = current_user.name
  end

  def update
    @name = current_user.name
    if current_user.update(user_params)
      redirect_to root_path
    else
      if current_user.target < 0
        @message = "目標金額がマイナスになっています"
      else
        @message = "既に使用されています！"
      end
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email).merge(target: params[:user][:target].to_i)
  end
  
end
