class ListsController < ApplicationController

  def new
    @list = List.new
    list1 = List.where(user_id: current_user.id).where(item_id: 1)
    list2 = List.where(user_id: current_user.id).where(item_id: 2)
    list3 = List.where(user_id: current_user.id).where(item_id: 3)
    @lists = [list1, list2, list3]
  end

  def create 
    @list = List.new(list_params)
    name_permit()
    if @list.save
      respond_to do |format|
        format.json
      end
    end
  end

  def destroy
    List.find(params[:list_id]).delete
  end


  private

  def list_params
    name = params[:name]
    if name == ""
      name = nil
    end
    params.permit(:item_id).merge(name: name, user_id: current_user.id)
  end

  def name_permit
    if (params[:name] == "" || params[:name].include?(" ") || params[:name].include?("　"))
      @book[:name] = nil
    end
  end

end
