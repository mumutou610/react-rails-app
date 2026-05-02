FactoryBot.define do
  factory :meal do
    association :user
    description { "鶏むね肉のサラダ" }
    eaten_at    { Date.today }
    memo        { "メモ" }
    ai_feedback { nil }
  end
end
