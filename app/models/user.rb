class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
  has_many :books
  has_many :lists
  
  validates :name, presence: true, uniqueness: true
  validates :target, :numericality => {:greater_than_or_equal_to => 0}
end
