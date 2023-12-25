# frozen_string_literal: true

# app
class ApplicationController < ActionController::Base
  before_action :set_session

  def set_session
    session.send(:load!)
    session[:id] ||= SecureRandom.uuid
  end
end
