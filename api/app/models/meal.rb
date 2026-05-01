class Meal < ApplicationRecord
  validates :description, presence: true
  validates :eaten_at, presence: true
end
