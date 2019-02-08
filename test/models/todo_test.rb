# frozen_string_literal: true

require "test_helper"

class TodoTest < ActiveSupport::TestCase
  test "should have a title" do
    todo = Todo.new title: "Todo number one"
    assert todo.valid?
    todo = Todo.new
    assert_not todo.valid?
  end
end
