class CreateMeals < ActiveRecord::Migration[7.2]
  def change
    create_table :meals do |t|
      t.string :description, null: false
      t.date :eaten_at, null: false
      t.text :memo
      t.text :ai_feedback

      t.timestamps
    end
  end
end
