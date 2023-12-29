# frozen_string_literal: true

# wow
class FormChannel < ApplicationCable::Channel
  include ::Y::Actioncable::Sync

  def subscribed
    # initiate sync & subscribe to updates, with optional persistence mechanism
    sync_for(params[:id]) do |id, update|
      save_doc(id, update)
    end
  end

  def receive(message)
    p message
    # broadcast update to all connected clients on all servers
    sync_to(params[:id], message)
  end

  def doc
    @doc ||= load { |id| load_doc(id) }
  end

  private

  def load_doc(id)
    puts '----------- LOAD DOC --------------'
    p id
    puts '-----------------------------------'

    # TODO: Load from DB if not in REDIS

    data = REDIS.get(id)
    data&.unpack('C*')
  end

  def save_doc(id, state)
    puts '----------- SAVE DOC --------------'
    p id
    puts '-----------------------------------'

    # TODO: Permissions + validity check. If invalid, undo changes

    REDIS.set(id, state.pack('C*'))

    # TODO: Throttled save to DB
  end
end
