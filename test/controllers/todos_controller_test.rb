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

  test "creating one should be valid" do
    post todos_path, as: :json, params: { title: "New todo" }
    assert_response :created

    post todos_path, as: :json, params: { title: nil }
    assert_response :unprocessable_entity
  end

  test "creating one should increase the index count" do
    # Retrieve initial list
    get todos_path
    assert_response :success
    todos = JSON.parse @response.body
    assert_equal todos.count, 20

    # Add one
    post todos_path, as: :json, params: { title: "New todo" }
    assert_response :created

    # Retrieve new list
    get todos_path
    assert_response :success
    todos = JSON.parse @response.body
    assert_equal todos.count, 21
  end

  test "show should return one todo" do
    get todos_path
    assert_response :success
    todos = JSON.parse @response.body
    first_id = todos[0]["id"]

    get todo_path id: first_id
    assert_response :success
    todo = JSON.parse @response.body
    assert todo.is_a? Object
    assert todo["title"].is_a? String
  end

  test "update should alter one todo" do
    # Get all todos and the first one's ID
    get todos_path
    assert_response :success
    todos = JSON.parse @response.body
    first_id = todos[0]["id"]

    # Get the todo and store initial title
    get todo_path id: first_id
    assert_response :success
    todo = JSON.parse @response.body
    old_title = todo["title"]

    # Update title
    todo["title"] = "Another title"
    put todo_path id: first_id, as: :json, params: { todo: todo }
    assert_response :ok

    # Retrieve same todo
    get todo_path id: first_id
    assert_response :success
    todo = JSON.parse @response.body

    # Compare titles
    assert_not_equal todo["title"], old_title
  end
end
