class Book < ApplicationRecord
  belongs_to :user
  belongs_to :item
end
