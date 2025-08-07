class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  enum role: { admin: 0, agent: 1, customer: 2 }

  has_many :tickets, foreign_key: :customer_id, dependent: :destroy
  has_many :assigned_tickets,  class_name: "Ticket", foreign_key: :agent_id
end
