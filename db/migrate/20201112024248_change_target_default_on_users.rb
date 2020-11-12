class ChangeTargetDefaultOnUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_default :users, :target, from: 0, to: 1
  end
end
