class AddCulomnNameOnAutoRecords < ActiveRecord::Migration[6.0]
  def change
    add_column :auto_records, :name, :string, null: false
  end
end
