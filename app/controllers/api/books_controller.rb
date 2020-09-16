class Api::BooksController < ApplicationController
  
  def index
    @books = Book.where(user_id: params[:user_id]).where("date LIKE ?", "%#{params[:date]}%").order(date: "ASC")
    @target = current_user.target
    if @books
      @money = get_income()
      @total = get_total()
      respond_to do |format|
        format.json
      end
    end
  end


  private

  def get_income()
    money = [0, 0, 0, 0, 0]
    5.times do |i|
      total = Book.where(user_id: params[:user_id]).where(item_id: i+1).where("date LIKE ?", "%#{params[:date]}%")
      total.each do |t|
        money[i] += t.money
      end
    end
    return money
  end

  def get_total()
    date_count = Book.where(user_id: params[:user_id]).select(:date).distinct
    date_array = []
    date_count.each do |t|
      date_array.push(t[:date].slice(0, 7))
    end
    date_array = date_array.uniq
    date_array = date_array.sort
    total_money = Array.new(date_array.length)
    count = 0
    date_array.each do |str|
      total_money[count] = 0
      money_db = Book.where(user_id: params[:user_id]).where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      money_db = Book.where(user_id: params[:user_id]).where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] -= m[:money]
      end
      count += 1
    end
    double_array = [date_array, total_money]
    return double_array
  end
  
end