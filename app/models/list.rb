class List < ApplicationRecord
  belongs_to :user
  belongs_to :item

  validates :name, length: {maximum: 15}
end
