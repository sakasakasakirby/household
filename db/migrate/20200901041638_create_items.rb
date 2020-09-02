class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string  :item,  null: false, default: ""
      t.timestamps
    end
  end
end
