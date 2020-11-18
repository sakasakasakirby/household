class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
  has_many :books
  has_many :lists
  has_many :auto_records
  
  validates :name, presence: true, uniqueness: true
  validates :target, :numericality => {:greater_than_or_equal_to => 1,  :less_than => 1000000000}
  validate :name_validation

  def name_validation
    maxLength = 10
    name.length.times do |i|
      if (name[i] =~ /\A[ぁ-んァ-ン一-龥]/) == 0
        maxLength = 5
        break
      end
    end
    if name.length > maxLength
      errors.add(:name, "日本語含まれているため5文字以内で入力してください")
    end
  end

end
