# frozen_string_literal: true

module ApplicationCable
  # doc
  class Connection < ActionCable::Connection::Base
    def connect
      # self.id = SecureRandom.uuid
    end

    def session
      # @request.session
      Data.define(:id).new('testsess')
    end
  end
end
