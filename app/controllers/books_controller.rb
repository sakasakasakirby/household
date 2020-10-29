class BooksController < ApplicationController

  def index
    @user_id = current_user.id
    @item_num = Item.select("id")
    @total = get_total(current_user.id)
    @target = User.find(current_user.id).target
  end

  def create
    @book = Book.new(book_params)
    name_permit()
    money_permit()
    if @book.save
      @income = income_create(params[:user_id], params[:item_id])
      @total = get_total(params[:user_id])
      @target = current_user.target
      respond_to do |format|
        format.json
      end
    end
  end

  def destroy
    delete_record(params[:array], params[:id], params[:item_id])
    if @deleted_book
      @income = income_delete(params[:id], params[:item_id])
      @total = get_total(params[:id])
      @target = current_user.target
      respond_to do |format|
        format.json
      end
    end
  end

  def update
    update_record(params[:array], params[:id], params[:item_id])
    if @update
      @income = income_update(params[:id], params[:item_id])
      @total = get_total(params[:id])
      @target = current_user.target
      respond_to do |format|
        format.json
      end
    end
  end

  def show
    @total = get_total_graph(params[:id])
    if @total.length != 0
      @average = get_average_graph(@total)
      @stack_total = get_stack_graph(@total)
    end
    @income = get_income_graph(params[:id])
    @expense = get_expense_graph(params[:id])
    @label = get_label_graph(params[:id])
  end

  def west_mountain
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

  def delete_record(params_array, user_id, item_id)
    params_array.each do |array|
      book = Book.where(user_id: user_id).where(item_id: item_id).where("date LIKE ?", "%#{array[1][0]}%").where(name: array[1][1]).where(money: array[1][2])
      book.length.times do |i|
        @deleted_book = Book.find(book[i][:id]).delete
      end
    end
  end

  def update_record(params_array, user_id, item_id)
    @update_books = []
    params_array.each do |array|
      if (array[1][:"1"][1] == "" || array[1][:"1"][1].include?(" ") || array[1][:"1"][1].include?("　"))
        array[1][:"1"][1] = nil
      end
      if (array[1][:"1"][2] == "0")
        array[1][:"1"][2] = nil
      end
      @before_book = Book.where(user_id: user_id).where(item_id: item_id).where("date LIKE ?", "%#{array[1][:"0"][0]}%").where(name: array[1][:"0"][1]).where(money: array[1][:"0"][2])
      @before_book.length.times do |i|
        @update = Book.find(@before_book[i][:id]).update(name: array[1][:"1"][1], money: array[1][:"1"][2])
      end
      @update_books.push([array[1][:"1"][0], array[1][:"1"][1], array[1][:"1"][2]])
    end
  end

  def income_calc(user_id, item_id, date)
    get_money = Book.where(user_id: user_id).where(item_id: item_id).where("date LIKE ?", "%#{date}%")
    income = 0
    get_money.each do |t|
      income += t.money
    end
    return income
  end

  def income_create(user_id, item_id)
    date = params[:date].slice(0..6)
    return income_calc(user_id, item_id, date)
  end

  def income_delete(user_id, item_id)
    date = params[:array][:"0"][0]
    if params[:id].to_i <= 2
      date = date.slice(0..6)
    end
    return income_calc(user_id, item_id, date)
  end

  def income_update(user_id, item_id)
    date = params[:array][:"0"]["0"][0].slice(0..6)
    return income_calc(user_id, item_id, date)
  end

  def get_total(id)
    date_array = get_date(id)
    total_money = total_calc(id, date_array)
    return [date_array, total_money]
  end

  def get_date(id)
    date_count = Book.where(user_id: id).select(:date).distinct
    date_array = []
    date_count.each do |t|
      date_array.push(t[:date].slice(0, 7))
    end
    date_array = date_array.uniq
    date_array = date_array.sort
    return date_array
  end

  def total_calc(id, date_array)
    total_money = Array.new(date_array.length)
    count = 0
    date_array.each do |str|
      total_money[count] = 0
      money_db = Book.where(user_id: id).where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      money_db = Book.where(user_id: id).where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      money_db.each do |m|
        total_money[count] -= m[:money]
      end
      count += 1
    end
    return total_money
  end


  #show
  def get_label_graph(id)
    return get_year_month(get_date(id))
  end

  def get_year_month(date_array)
    year_array = []
    month_array = []
    date_array.each do |t|
      year_array.push(t.slice(0, 4).to_i)
      month_array.push(t.slice(5, 7).to_i)
    end
    return [year_array, month_array]
  end

  def get_total_graph(id)
    return total_calc(id, get_date(id))
  end

  def get_average_graph(array)
    average = 0
    array.each do |money|
      average += money
    end
    return average/array.length
  end

  def get_stack_graph(array)
    stack_array = []
    count = 0
    array.each do |money|
      if count == 0
        stack_array.push(money)
      else
        stack_array.push(stack_array[count-1] + money)
      end
      count += 1 
    end
    return stack_array
  end

  def get_income_graph(id)
    return calc_income_expense(id, get_date(id), "income")
  end

  def get_expense_graph(id)
    return calc_income_expense(id, get_date(id), "expense")
  end

  def calc_income_expense(id, date_array, name)
    total_money = Array.new(date_array.length)
    count = 0
    date_array.each do |str|
      total_money[count] = 0
      if name == "income"
        money_db = Book.where(user_id: id).where("date LIKE ?", "%#{str}%").where(item_id: 5).select(:money)
      elsif name == "expense"
        money_db = Book.where(user_id: id).where("date LIKE ?", "%#{str}%").where.not(item_id: 5).select(:money)
      end
      money_db.each do |m|
        total_money[count] += m[:money]
      end
      count += 1
    end
    return total_money
  end

end
