# frozen_string_literal: true

require "application_system_test_case"

class TodosTest < ApplicationSystemTestCase
  def setup
    visit root_url
  end

  test "creating new todo" do
    assert_selector "h1", text: "RaRe TODOs"

    item_count = page.all(".todo-list-item").count
    form = page.first "#todo-form"
    title_field = form.first "[name='title']"
    title1 = "Capybara Todo #1"
    title2 = "Capybara Todo #2"

    # Save valid
    title_field.fill_in with: title1
    click_on "Save"

    page.first("#todo-list").assert_text title1
    page.assert_selector ".todo-list-item", count: item_count + 1

    # Save invalid (form should be cleared)
    click_on "Save"

    page.first("#todo-list").assert_no_text title2
    page.assert_selector ".todo-list-item", count: item_count + 1

    # Save valid
    title_field.fill_in with: title2
    click_on "Save"

    page.first("#todo-list").assert_text title2
    page.assert_selector ".todo-list-item", count: item_count + 2
  end

  test "deleting a todo" do
    item_count = page.all(".todo-list-item").count

    dismiss_confirm do
      page.first(".todo-list-item").first(".delete-form button").click
    end
    page.assert_selector ".todo-list-item", count: item_count

    accept_confirm do
      page.first(".todo-list-item").first(".delete-form button").click
    end
    page.assert_selector ".todo-list-item", count: item_count - 1
  end

  test "toggle a todo" do
    item = page.first ".todo-list-item"
    initial_done = item[:class].split(" ").include? "done"

    # Toggle state
    item.first(".toggle-done-form button").click
    item.assert_not_matches_selector(".done") if initial_done
    item.assert_matches_selector(".done") unless initial_done

    # Toggle state
    item.first(".toggle-done-form button").click
    item.assert_matches_selector(".done") if initial_done
    item.assert_not_matches_selector(".done") unless initial_done

    # Toggle state
    item.first(".toggle-done-form button").click
    item.assert_not_matches_selector(".done") if initial_done
    item.assert_matches_selector(".done") unless initial_done
  end

  test "edit a todo" do
    form = page.first "#todo-form"
    title_field = form.first "[name='title']"
    item = page.first ".todo-list-item:not(.done)"
    old_title = item.first(".todo-title").text

    item.first(".edit-form button").click
    assert_equal title_field.value, old_title

    new_title = "Capybara Todo Edited"

    # Save invalid
    title_field.fill_in with: ""
    click_on "Save"
    title_field.sibling(".help-block").assert_text "can't be blank"

    # Save valid
    title_field.fill_in with: new_title
    click_on "Save"
    page.first("#todo-list").assert_text new_title
  end

  def sort_asc
    # First item should be the futurest date
    first_title = page.first(".todo-list-item .todo-title").text
    page.first("a", text: "ascending").click
    last_title = page.all(".todo-list-item").last.find(".todo-title").text
    assert_equal first_title, last_title
  end

  def sort_desc
    # Last item should be the futurest date
    last_title = page.all(".todo-list-item").last.find(".todo-title").text
    page.first("a", text: "descending").click
    first_title = page.first(".todo-list-item .todo-title").text
    assert_equal first_title, last_title
  end

  test "sort todos" do
    if has_selector? "a", text: "ascending"
      sort_asc
      sort_desc
    else
      sort_desc
      sort_asc
    end
  end
end
