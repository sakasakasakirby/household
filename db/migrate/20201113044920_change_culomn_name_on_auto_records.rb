class ChangeCulomnNameOnAutoRecords < ActiveRecord::Migration[6.0]
  def change
    remove_column :auto_records, :name, :string
  end
end
