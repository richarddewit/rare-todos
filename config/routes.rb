# frozen_string_literal: true

Rails.application.routes.draw do
  root "static_pages#home"

  scope "api" do
    scope "v1" do
      resources :todos
    end
  end
end
