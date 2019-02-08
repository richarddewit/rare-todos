class CreateTodos < ActiveRecord::Migration[5.2]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.date :due_date
      t.text :body
      t.date :completed_on

      t.timestamps
    end
  end
end
