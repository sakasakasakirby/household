class BooksController < ApplicationController

  def index
  end

  def create
    @book = Book.new(book_params)
    name_permit()
    money_permit()
    if @book.save
      @income = income_calc()
      @total = get_total()
      respond_to do |format|
        format.json
      end
    end
  end


  private

  def book_params
    params.permit(:name, :money, :date, :item_id)
  end

  def name_permit
    if (@book[:name] == "" || @book[:name].include?(" ") || @book[:name].include?("　"))
      @book[:name] = nil
    end
  end

  def money_permit
    if (@book[:money] == 0)
      @book[:money] = nil
    end
  end

  def income_calc
    date = params[:date].slice(0..6)
    get_money = Book.where(item_id: params[:item_id]).where("date LIKE ?", "%#{date}%")
    income = 0
    get_money.each do |t|
      income += t.money
    end
    return income
  end

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
