class AutoRecordsController < ApplicationController
  before_action :before_method

  def new
    @autoRecord = AutoRecord.new
  end

  def create
    @autoRecord = AutoRecord.new(autoRecord_params)
    name_permit()
    if @autoRecord.save
      redirect_to root_path
    else
      if @autoRecord[:name] == nil
        flash.now[:alert] = "項目名に空白が含まれています。空白を除いて入力してください。"
      elsif @autoRecord[:money] <= 0 || @autoRecord[:money] >= 100000000
        flash.now[:alert] = "金額に数値以外、もしくは0以下1,000,000,000以上の値が入力されています。1~999,999,999の範囲の整数値を入力してください。"
      end
      render :new
    end
  end
  

  private

  def before_method
    @item = Item.all
    @day = []
    31.times do |i|
      @day.push(i + 1)
    end
  end

  def autoRecord_params
    params[:auto_record].permit(:name, :money, :date, :item_id).merge(user_id: current_user.id)
  end

  def name_permit
    if (@autoRecord[:name] == "" || @autoRecord[:name].include?(" ") || @autoRecord[:name].include?("　"))
      @autoRecord[:name] = nil
    end
  end

end
