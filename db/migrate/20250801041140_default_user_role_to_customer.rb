class DefaultUserRoleToCustomer < ActiveRecord::Migration[8.0]
  def change
    change_column_default :users, :role, from: nil, to: 2
    User.where(role: nil).update_all(role: 2)
  end
end
