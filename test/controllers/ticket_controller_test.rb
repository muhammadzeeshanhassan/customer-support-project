require "test_helper"

class TicketControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get ticket_index_url
    assert_response :success
  end

  test "should get new" do
    get ticket_new_url
    assert_response :success
  end

  test "should get create" do
    get ticket_create_url
    assert_response :success
  end

  test "should get edit" do
    get ticket_edit_url
    assert_response :success
  end

  test "should get updte" do
    get ticket_updte_url
    assert_response :success
  end

  test "should get destroy" do
    get ticket_destroy_url
    assert_response :success
  end
end
