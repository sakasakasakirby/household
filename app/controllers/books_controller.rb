class BooksController < ApplicationController

  def index
    @user_id = current_user.id
    @item_num = Item.select("id")
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

  def show
    @total = get_total_graph()
    @income = get_income_graph()
    @expense = get_expense_graph()
    if @total.length != 0
      @average = get_average_graph(@total)
    end
    @label = get_date_graph()
    #label = get_income_graph()[0]
    #@label = label.join(',')
    #binding.pry
  end


  private

  def book_params
    params.permit(:name, :money, :date, :item_id).merge(user_id: current_user.id)
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
    get_money = Book.where(user_id: params[:user_id]).where(item_id: params[:item_id]).where("date LIKE ?", "%#{date}%")
    income = 0
    get_money.each do |t|
      income += t.money
    end
    return income
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

  def get_average_graph(array)
    average = 0
    array.each do |money|
      average += money
    end
    return average/array.length
  end

  def get_total_graph()
    date_count = Book.where(user_id: params[:id]).select(:date).distinct
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
      money_db = Book.where(user_id: params[:id]).where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      money_db = Book.where(user_id: params[:id]).where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] -= m[:money]
      end
      count += 1
    end
    return total_money
  end

  def get_income_graph()
    date_count = Book.where(user_id: params[:id]).select(:date).distinct
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
      money_db = Book.where(user_id: params[:id]).where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      count += 1
    end
    return total_money
  end

  def get_expense_graph()
    date_count = Book.where(user_id: params[:id]).select(:date).distinct
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
      money_db = Book.where(user_id: params[:id]).where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      count += 1
    end
    return total_money
  end

  def get_date_graph()
    date_count = Book.where(user_id: params[:id]).select(:date).distinct
    date_array = []
    date_count.each do |t|
      date_array.push(t[:date].slice(0, 7))
    end
    date_array = date_array.uniq
    date_array = date_array.sort
    year_array = []
    month_array = []
    date_array.each do |t|
      year_array.push(t.slice(0, 4).to_i)
      month_array.push(t.slice(5, 7).to_i)
    end
    double_array = [year_array, month_array]
    return double_array
  end

  def graph_data(array)
    data_array = []
    array[0].length.times do |c|
      a = []
      a[0] = array[0][c]
      a.push(array[1][c])
      data_array.push(a)
    end
    return data_array
  end

end
