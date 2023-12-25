# frozen_string_literal: true

# Home controller
class HomeController < ApplicationController
  def index
    puts "session['init'] = #{session['init']}"
  end
end
