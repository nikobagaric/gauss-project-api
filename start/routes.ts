/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return 'Hello world'
})

Route.group(() => {
  // Auth routes, available to non-authenticated users
  Route.post('/signup', 'AuthController.signup')
  Route.post('/login', 'AuthController.login')

  Route.get('/login/github', 'OAuthController.gitRedirect')
  Route.get('/login/github/callback', 'OAuthController.gitCallback')

}).middleware('guest')


Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UserController.show')
  Route.get('/users/:id/friend_list', 'FriendsController.index')

  Route.get('/posts', 'PostsController.index')
  Route.get('/posts/:id', 'PostsController.show')
  Route.get('/posts/:id/likes', 'LikesController.index')

  Route.get('/verify-email/:email', 'VerificationsController.confirm').as('verifyEmail')
})

Route.group(() => {
  // Auth only routes
  Route.post('/logout', 'AuthController.logout')

  Route.put('/users/:id', 'UsersController.update')

  Route.post('/posts', 'PostsController.store')
  Route.put('/posts/:id', 'PostsController.update')
  Route.delete('/posts/:id', 'PostsController.destroy')
  Route.post('/posts/:id/like', 'LikesController.store')
  Route.delete('/posts/:id/unlike', 'LikesController.destroy')

  Route.post('/users/:id/add', 'FriendsController.store')
  Route.delete('/users/:id/remove', 'FriendsController.destroy')

  Route.post('/verify-email', 'EmailVerifiesController.index')
}).middleware('auth')
