class ChangeNameDefaultOnAutoRecords < ActiveRecord::Migration[6.0]
  def change
    change_column_default :auto_records, :name, from: true, to: false
  end
end
