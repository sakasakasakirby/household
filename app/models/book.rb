class Book < ApplicationRecord
  belongs_to :user
  belongs_to :item

  validates :name, length: {maximum: 15}
  validates :money, presence: true, :numericality => { :greater_than_or_equal_to => 1,  :less_than => 100000000}
end
