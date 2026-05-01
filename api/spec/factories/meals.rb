FactoryBot.define do
  factory :meal do
    description { "鶏むね肉のサラダ" }
    eaten_at    { Date.today }
    memo        { "メモ" }
    ai_feedback { nil }
  end
end
