class BooksController < ApplicationController

  def index
  end

  def create
    @book = Book.new(book_params)
    if (@book[:name] == "" || @book[:name].include?(" ") || @book[:name].include?("　"))
      @book[:name] = nil
    elsif (@book[:money] == 0)
      @book[:money] = nil
    end
    if @book.save
      total = Book.where(item_id: params[:item_id])
      @money = 0
      total.each do |t|
        @money += t.money
      end
      respond_to do |format|
        format.json
      end
    end
  end


  private

  def book_params
    params.permit(:name, :money, :date, :item_id)
  end

end
