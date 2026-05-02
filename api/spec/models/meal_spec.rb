require 'rails_helper'

RSpec.describe Meal, type: :model do
  describe 'バリデーション' do
    it '有効なファクトリを持つ' do
      expect(build(:meal)).to be_valid
    end

    it 'descriptionがなければ無効' do
      expect(build(:meal, description: '')).not_to be_valid
    end

    it 'eaten_atがなければ無効' do
      expect(build(:meal, eaten_at: nil)).not_to be_valid
    end

    it 'memoはなくても有効' do
      expect(build(:meal, memo: nil)).to be_valid
    end

    it 'ai_feedbackはなくても有効' do
      expect(build(:meal, ai_feedback: nil)).to be_valid
    end
  end

  describe 'アソシエーション' do
    it 'userに属する' do
      meal = create(:meal)
      expect(meal.user).to be_a(User)
    end
  end
end
