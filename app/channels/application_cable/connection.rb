# frozen_string_literal: true

module ApplicationCable
  # doc
  class Connection < ActionCable::Connection::Base
    identified_by :id

    def connect
      self.id = SecureRandom.uuid
    end
  end
end
