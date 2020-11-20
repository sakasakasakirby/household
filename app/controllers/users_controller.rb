class UsersController < ApplicationController

  def edit
    check_path_id()
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
        jp = check_jp()
        if current_user.target < 1 || current_user.target >= 1000000000
          flash.now[:alert] = "目標金額に数値以外、もしくは0以下1,000,000,000以上の値が入力されています。1~999,999,999の範囲の整数値を入力してください。"
        elsif params[:user][:name] == "" || params[:user][:email] == ""
          flash.now[:alert] = "NameもしくはEmailが入力されていません。変更したいものを入力してください。"
        elsif params[:user][:name].length > 10
          flash.now[:alert] = "Nameが11文字以上で入力されています。10文字以内で入力してください。"
        elsif params[:user][:name].length > 5 && jp == 1
          flash.now[:alert] = "Nameにかな, カナ, 漢字のいずれかが含まれている場合は5文字以内で入力してください。"
        elsif current_user.errors.full_messages[0] == "Targetは数値で入力してください"
          flash.now[:alert] = "目標金額は数値で入力してください。"
        else
          flash.now[:alert] = "入力されたName、もしくはEmailは既に使用されています。異なるものを入力してください。"
        end
        render :edit
      end
    end
  end

  def show
    check_path_id()
    @autoRecord = current_user.auto_records.where.not(item_id: 2).where.not(item_id: 5).order(item_id: "ASC").order(date: "ASC")
    @autoRecord_other = current_user.auto_records.where(item_id: 2)
    @autoRecord_income = current_user.auto_records.where(item_id: 5)
    @array = [@autoRecord, @autoRecord_other, @autoRecord_income]
  end

  
  private

  def user_params
    params.require(:user).permit(:name, :email).merge(target: params[:user][:target])
  end

  def check_path_id
    id = params[:id]
    if id.to_i == current_user.id
      @name = current_user.name
    else
      redirect_to root_path
    end
  end

  def check_jp
    maxLength = 10
    params[:user][:name].length.times do |i|
      if (params[:user][:name][i] =~ /\A[ぁ-んァ-ン一-龥]/) == 0
        maxLength = 5
        break
      end
    end
    if params[:user][:name].length > maxLength
      return 1
    end
    return 0
  end
  
end
