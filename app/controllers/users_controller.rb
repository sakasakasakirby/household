class UsersController < ApplicationController

  def edit
    @name = current_user.name
  end

  def update
    @name = current_user.name
    if current_user.update(user_params)
      redirect_to root_path
    else
      if current_user.target < 0 || current_user.target >= 1000000000
        message = "目標金額に負の値、もしくは1,000,000,000以上の値が入力されています。0~999,999,999の範囲で値を入力してください。"
      elsif params[:user][:name] == "" || params[:user][:email] == ""
        message = "NameもしくはEmailが入力されていません。変更したいものを入力してください。"
      elsif params[:user][:name].length > 10
        message = "Nameが11文字以上で入力されています。10文字以内で入力してください。"
      else
        message = "入力されたName、もしくはEmailは既に使用されています。異なるものを入力してください。"
      end
      redirect_to edit_user_path(current_user), flash: {error: message}
    end
  end

  
  private

  def user_params
    params.require(:user).permit(:name, :email).merge(target: params[:user][:target].to_i)
  end
  
end
