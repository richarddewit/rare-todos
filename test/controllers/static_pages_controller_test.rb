# frozen_string_literal: true

require "test_helper"

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get root_path
    assert_response :success
    assert_select "h1", "RaRe TODOs"
  end
end
