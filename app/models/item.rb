class Item < ApplicationRecord
  has_many :books
  has_many :lists
end
