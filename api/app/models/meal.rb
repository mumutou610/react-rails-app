class Meal < ApplicationRecord
  belongs_to :user

  validates :description, presence: true
  validates :eaten_at, presence: true
end
