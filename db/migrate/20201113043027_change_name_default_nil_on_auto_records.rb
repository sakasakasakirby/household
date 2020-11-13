class ChangeNameDefaultNilOnAutoRecords < ActiveRecord::Migration[6.0]
  def change
    change_column_default :auto_records, :name, from: 0, to: nil
  end
end
