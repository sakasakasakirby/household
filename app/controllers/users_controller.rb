class UsersController < ApplicationController

  def edit
    @name = current_user.name
  end

  def update
    @name = current_user.name
    if current_user.update(user_params)
      redirect_to root_path
    else
      @message = "既に使用されています！"
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
  
end
