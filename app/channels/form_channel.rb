# frozen_string_literal: true

# wow
class FormChannel < ApplicationCable::Channel
  include ::Y::Actioncable::Sync

  def subscribed
    # initiate sync & subscribe to updates, with optional persistence mechanism
    sync_for(session)
  end

  def receive(message)
    # broadcast update to all connected clients on all servers
    sync_to(session, message)
  end
end
