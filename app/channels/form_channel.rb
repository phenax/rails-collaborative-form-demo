# frozen_string_literal: true

# wow
class FormChannel < ApplicationCable::Channel
  include ::Y::Actioncable::Sync

  def subscribed
    # initiate sync & subscribe to updates, with optional persistence mechanism
    sync_for(session) do |id, update|
      save_doc(id, update)
    end
  end

  def receive(message)
    # broadcast update to all connected clients on all servers
    sync_to(session, message)
  end

  def doc
    @doc ||= load { |id| load_doc(id) }
  end

  private

  def load_doc(id)
    data = REDIS.get(id)
    data = data.unpack('C*') unless data.nil?
    data
  end

  def save_doc(id, state)
    REDIS.set(id, state.pack('C*'))
  end
end
