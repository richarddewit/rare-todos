# frozen_string_literal: true

require "test_helper"

class TodoTest < ActiveSupport::TestCase
  def setup
    @todo = Todo.new
  end

  test "should be valid with a title" do
    @todo.title = "Todo number one"
    assert @todo.valid?
  end

  test "should be invalid without a title" do
    assert_not @todo.valid?
  end
end
