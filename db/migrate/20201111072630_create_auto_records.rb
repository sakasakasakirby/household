class CreateAutoRecords < ActiveRecord::Migration[6.0]
  def change
    create_table :auto_records do |t|

      t.string    :name,  null: false, default: ""
      t.integer   :money, null: false
      t.string  :date,  null: false, default: ""

      t.references   :item, foreign_key: true
      t.references   :user, foreign_key: true

      t.timestamps
    end
  end
end
