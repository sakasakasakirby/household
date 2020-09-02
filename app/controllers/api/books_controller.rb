class Api::BooksController < ApplicationController
  def index
    @books = Book.where("date LIKE ?", "%#{params[:date]}%").order(date: "ASC")
    @money = [0, 0, 0, 0, 0]
    5.times do |i|
      total = Book.where(item_id: i+1).where("date LIKE ?", "%#{params[:date]}%")
      total.each do |t|
        @money[i] += t.money
      end
    end
    @total = get_total()

    if @books
      respond_to do |format|
        format.json
      end
    end
  end


  private

  def get_total()
    date_count = Book.select(:date).distinct
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
      money_db = Book.where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      money_db = Book.where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] -= m[:money]
      end
      count += 1
    end
    double_array = [date_array, total_money]

    return double_array
  end
  
end