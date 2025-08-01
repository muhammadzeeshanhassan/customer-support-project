class CreateTickets < ActiveRecord::Migration[8.0]
  def change
    create_table :tickets do |t|
      t.string :subject
      t.text :description
      t.integer :status
      t.integer :priority
      t.references :customer, null: false,
  foreign_key: { to_table: :users }
t.references :agent,    null: true,  
  foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
