class Item < ApplicationRecord
  has_many :books
  has_many :lists
  has_many :auto_records
end
