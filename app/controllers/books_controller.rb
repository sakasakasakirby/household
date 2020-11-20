class BooksController < ApplicationController

  def index
    @user_id = current_user.id
    @item_num = Item.select("id")
    @total = get_total(current_user.id)
    @target = User.find(current_user.id).target
    money_ranking()
    today_info()
  end

  def create
    @book = Book.new(book_params)
    name_permit()
    money_permit()
    if @book.save
      @income = income_create(params[:user_id], params[:item_id])
      @total = get_total(params[:user_id])
      @target = current_user.target
      money_ranking()
      today_info()
      @todayInfo = [@todayExpense, @todayIncome, @currentBook[0].name]
      respond_to do |format|
        format.json
      end
    end
  end

  def select_box
    @lists = List.where(user_id: current_user.id).where(item_id: params[:item_id])
    @array = []
    @lists.each do |list|
    @array.push(list[:name])
    end
    respond_to do |format|
      format.json
    end
  end

  def destroy
    delete_record(params[:array], params[:id], params[:item_id])
    if @deleted_book
      @income = income_delete(params[:id], params[:item_id])
      @total = get_total(params[:id])
      @target = current_user.target
      money_ranking()
      today_info()
      if @currentBook != []
        @todayInfo = [@todayExpense, @todayIncome, @currentBook[0].name]
      else
        @todayInfo = [@todayExpense, @todayIncome, nil]
      end
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
      money_ranking()
      respond_to do |format|
        format.json
      end
    end
  end

  def show
    check_path_id()
    @total = get_total_graph(params[:id])
    if @total.length != 0
      @average = get_average_graph(@total)
      @stack_total = get_stack_graph(@total)
    end
    @income = get_income_graph(params[:id])
    @expense = get_expense_graph(params[:id])
    @label = get_label_graph(params[:id])
    array_only12()
  end

  def west_mountain
  end


  private

  def book_params
    params.permit(:name, :money, :date, :item_id).merge(user_id: current_user.id)
  end

  def check_path_id
    id = params[:id]
    if id.to_i == current_user.id
      @name = current_user.name
    else
      redirect_to root_path
    end
  end

  def name_permit
    if (@book[:name] == "" || @book[:name].include?(" ") || @book[:name].include?("　"))
      @book[:name] = nil
    end
  end

  def money_permit
    if (@book[:money] == 0 || @book[:money] >= 100000000)
      @book[:money] = nil
    end
  end

  def money_ranking
    books = current_user.books.where.not(item_id: 4).where.not(item_id: 5).where("date LIKE ?", "%#{Time.now.to_s.slice(0, 7)}%")
    array_name = []
    array_money = []
    books.each do |book|
      tf = false
      array_name.length.times do |i|
        if array_name[i] == book.name
          array_money[i] += book.money
          tf = true
        end
      end
      if !tf
        array_name.push(book.name)
        array_money.push(book.money)
      end
    end
    @rankName = []
    @rankMoney = []
    if array_name.length > 3
      count = 3
    else
      count = array_name.length
    end
    count.times do
      maxIndex = 0;
      (array_name.length-1).times do |i|
        if array_money[i+1] > array_money[maxIndex]
          maxIndex = i + 1
        end
      end
      @rankName.push(array_name[maxIndex])
      @rankMoney.push(array_money[maxIndex])
      array_name.delete_at(maxIndex)
      array_money.delete_at(maxIndex)
    end
    @maxMoneyRank = @rankName
  end

  def today_info()
    todayExpense = current_user.books.where.not(item_id: 5).where(date: Time.now.to_s.slice(0, 10))
    @todayExpense = 0
    todayIncome = current_user.books.where(item_id: 5).where(date: Time.now.to_s.slice(0, 10))
    @todayIncome = 0
    todayExpense.each do |book|
      @todayExpense += book.money
    end
    todayIncome.each do |book|
      @todayIncome += book.money
    end
    @currentBook = current_user.books.limit(1).where.not(item_id: 5).where(date: Time.now.to_s.slice(0, 10)).order('id DESC')
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
      if (array[1][:"1"][2] == "0" || array[1][:"1"][2] == "NaN")
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

  def array_only12()
    if @label[0].length > 12
      (@label[0].length - 12).times do
        @total.shift()
        @stack_total.shift()
        @income.shift()
        @expense.shift()
        @label[0].shift()
        @label[1].shift()
      end
    end
  end

end
