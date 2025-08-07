class Ticket < ApplicationRecord
  enum :status,   { open: 0, pending: 1, closed: 2 }
  enum :priority, { low: 0, medium: 1, high: 2 }

  belongs_to :customer, class_name: "User"
  belongs_to :agent, class_name: "User", optional: true

  validates :subject, presence: true, length: { minimum: 15, maximum: 100 }
  validates :description, presence: true, length: { minimum: 50, maximum: 300 }

  after_update :notify_customer_of_status_change

  private

  def notify_customer_of_status_change
    TicketMailer.notify_customer_of_status_change(self).deliver_later
  end
end
