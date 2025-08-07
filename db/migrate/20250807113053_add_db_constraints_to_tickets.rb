class AddDbConstraintsToTickets < ActiveRecord::Migration[8.0]
  def change
    change_column_null :tickets, :subject, false
    change_column_null :tickets, :description, false

    change_column_null :tickets, :status, false

    change_column_null    :tickets, :priority, false, 0
    change_column_default :tickets, :priority, from: nil, to: 0

    add_check_constraint :tickets,
      "LENGTH(subject) BETWEEN 15 AND 100",
      name: "tickets_subject_length"

    add_check_constraint :tickets,
      "LENGTH(description) BETWEEN 50 AND 300",
      name: "tickets_description_length"
  end
end
