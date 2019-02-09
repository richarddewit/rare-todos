# frozen_string_literal: true

require "test_helper"

class TodosControllerTest < ActionDispatch::IntegrationTest
  test "index should return a JSON list of Todos" do
    get todos_path
    assert_response :success

    todos = JSON.parse @response.body
    assert todos.is_a? Array
    assert todos[0].is_a? Object
    assert todos[0]["title"].is_a? String
  end
end
