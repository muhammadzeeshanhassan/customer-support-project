require "rails_helper"

RSpec.describe User, type: :model do
  it { should define_enum_for(:role).with_values(admin: 0, agent: 1, customer: 2) }

  it { should have_many(:tickets).with_foreign_key(:customer_id).dependent(:destroy) }
  it { should have_many(:assigned_tickets).class_name("Ticket").with_foreign_key(:agent_id) }

  describe "validations" do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should allow_value("user@example.com").for(:email) }
    it { should_not allow_value("not-an-email").for(:email) }

    it { should validate_presence_of(:password) }
    it { should validate_confirmation_of(:password) }
    it { should validate_length_of(:password).is_at_least(6) }
  end
end
