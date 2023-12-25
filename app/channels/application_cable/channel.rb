# frozen_string_literal: true

module ApplicationCable
  # chn
  class Channel < ActionCable::Channel::Base
    def session
      connection.session
    end
  end
end
