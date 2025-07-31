class Ticket < ApplicationRecord

  enum :status, {open: 0, pending: 1, closed: 2}
  enum :priority, {low: 0, medium: 1, high: 2}

  belongs_to :customer , class_name: 'User'
  belongs_to :agent, class_name: 'User', optional: true

  validates :subject, presence: true
  validates :description, presence: true
end
