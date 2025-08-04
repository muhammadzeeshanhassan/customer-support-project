class Ticket < ApplicationRecord

  enum :status, {open: 0, pending: 1, closed: 2}
  enum :priority, {low: 0, medium: 1, high: 2}

  after_update :notify_customer_of_status_change

  private

  def notify_customer_of_status_change
    TicketMailer.notify_customer_of_status_change(self).deliver_later
  end

  belongs_to :customer , class_name: 'User'
  belongs_to :agent, class_name: 'User', optional: true

  validates :subject, presence: true
  validates :description, presence: true
end
