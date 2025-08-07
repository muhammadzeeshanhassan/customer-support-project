class UserNotificationWorker
  include Sidekiq::Worker
  sidekiq_options retry: 2

  def perform(user_id, type)
    user = User.find(user_id)
    case type
    when "signup"
      UserMailer.welcome_email(user).deliver_now
    end
  end
end
