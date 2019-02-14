# RaRe TODOs - Todo app made with Rails and React

This is an example app to showcase the following techniques:

- [x] Ruby (`v2.5.3`) on Rails (`v5.2.2`) as CRUD-backend
- [x] React with hooks (`v16.8`) as frontend
- [x] TypeScript
- [x] Bootstrap 3 (`v3.4.0`)
- [x] Rails tests for CRUD API
- [x] Capybara tests for React

Link to ["production" Heroku app](https://rare-todos.herokuapp.com/)

## Assignment

> Create a simple TODO app with a Rails CRUD-backend and a React frontend.

A todo should contain:

- Title
- Due date (optional, sortable)
- Body (optional)
- Done state (or perhaps a `completed_on` date?)

## Running locally

```
git clone https://github.com/richarddewit/rare-todos.git
cd rare-todos
bundle install --without production
nvm use
yarn install
rails db:migrate
rails db:fixtures:load
rails s
```

### Testing

API testing
```
rails test
xdg-open coverage/index.html
```

Browser testing
```
rails test:system
```

### Deploying to Heroku

```
heroku create --region eu
heroku addons:create heroku-postgresql
git push heroku master
heroku open
```
