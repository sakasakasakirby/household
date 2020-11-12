class UsersController < ApplicationController

  def edit
    @name = current_user.name
  end

  def update
    @name = current_user.name
    if params[:user][:name].include?(" ") || params[:user][:name].include?("　")
      message = "Nameに空白が含まれています。空白を除いて入力してください。"
      redirect_to edit_user_path(current_user), flash: {error: message}
    else
      if current_user.update(user_params)
        redirect_to root_path
      else
        if current_user.target < 1 || current_user.target >= 1000000000
          message = "目標金額に数値以外、もしくは0以下1,000,000,000以上の値が入力されています。1~999,999,999の範囲の整数値を入力してください。"
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
  end

  
  private

  def user_params
    params.require(:user).permit(:name, :email).merge(target: params[:user][:target])
  end
  
end
