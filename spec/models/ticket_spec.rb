require "rails_helper"

RSpec.describe Ticket, type: :model do

  it { should define_enum_for(:status).with_values(open: 0, pending: 1, closed: 2) }
  it { should define_enum_for(:priority).with_values(low: 0, medium: 1, high: 2)}

  it { should belong_to(:customer).class_name("User") }
  it { should belong_to(:agent). class_name("User").optional }

  it { should validate_presence_of(:subject) }
  it { should validate_presence_of(:description)}

end

