# frozen_string_literal: true

class StaticPagesController < ApplicationController
  def home
    @todos = Todo.all.order("due_date DESC, created_at DESC")
  end
end
