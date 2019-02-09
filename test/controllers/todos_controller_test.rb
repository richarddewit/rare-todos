# frozen_string_literal: true

require "test_helper"

class TodosControllerTest < ActionDispatch::IntegrationTest
  def retrieve_list
    get todos_path
    assert_response :success
    JSON.parse @response.body
  end

  def retrieve_single(id)
    get todo_path id: id
    assert_response :success
    JSON.parse @response.body
  end

  test "index should return a JSON list of Todos" do
    todos = retrieve_list
    assert todos.is_a? Array
    assert todos[0].is_a? Object
    assert todos[0]["title"].is_a? String
  end

  test "creating a todo should be valid" do
    post todos_path, as: :json, params: { title: "New todo" }
    assert_response :created

    post todos_path, as: :json, params: { title: nil }
    assert_response :unprocessable_entity
  end

  test "creating a todo should increase the index count" do
    # Retrieve initial list
    todos = retrieve_list
    initial_count = todos.count

    # Add a todo
    post todos_path, as: :json, params: { title: "New todo" }
    assert_response :created

    # Retrieve new list
    todos = retrieve_list
    assert_equal todos.count, initial_count + 1
  end

  test "show should return a todo" do
    todos = retrieve_list
    first_id = todos[0]["id"]

    todo = retrieve_single first_id
    assert todo.is_a? Object
    assert todo["title"].is_a? String
  end

  test "update should alter a todo" do
    # Get all todos and the first todo's ID
    todos = retrieve_list
    first_id = todos[0]["id"]

    # Get the todo and store initial title
    todo = retrieve_single first_id
    old_title = todo["title"]

    # Update title with invalid title
    todo["title"] = nil
    put todo_path id: first_id, as: :json, params: { todo: todo }
    assert_response :unprocessable_entity

    # Update title
    todo["title"] = "Another title"
    put todo_path id: first_id, as: :json, params: { todo: todo }
    assert_response :ok

    # Retrieve same todo
    todo = retrieve_single first_id

    # Compare titles
    assert_not_equal todo["title"], old_title
  end

  test "deleting a todo should decrease the index count" do
    # Retrieve initial list and the first todo's ID
    todos = retrieve_list
    initial_count = todos.count
    first_id = todos[0]["id"]

    # Delete a todo
    delete todo_path id: first_id
    assert_response :no_content

    # Retrieve new list
    todos = retrieve_list
    assert_equal todos.count, initial_count - 1
  end
end
