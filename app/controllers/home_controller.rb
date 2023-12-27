# frozen_string_literal: true

# Home controller
class HomeController < ApplicationController
  def index
    p '---------------- page load ----------------'
  end

  def healthz
    render json: { status: 'OK' }, status: :ok
  end
end
