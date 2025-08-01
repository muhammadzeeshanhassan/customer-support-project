class AddDefaultStatusToTicket < ActiveRecord::Migration[8.0]
  def change
    change_column_default :tickets, :status, from: nil, to: 0
    Ticket.where(status: nil).update_all(status: 0)
  end
end
