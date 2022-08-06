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

Route.get('/', () => {
  return 'Hello world'
})

Route.get('/test', async ({auth}) => {
  return await auth.use('api').authenticate()
})

Route.group(() => {
  Route.post('/signup', 'AuthController.signup')
  Route.post('/login', 'AuthController.login')

  Route.get('/login/github', 'OAuthController.gitRedirect')
  Route.get('/login/github/callback', 'OAuthController.gitCallback')

  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UserController.show')

  Route.get('/verify-email/:email', 'VerificationsController.confirm').as('verifyEmail')
}).middleware('guest')

Route.group(() => {
  Route.post('/logout', 'AuthController.logout')

  Route.put('/users/:id', 'UsersController.update')

  Route.get('/posts', 'PostsController.index')
  Route.get('/posts/:id', 'PostsController.show')
  Route.post('/posts', 'PostsController.store')
  Route.put('/posts/:id', 'PostsController.update')
  Route.delete('/posts/:id', 'PostsController.destroy')
  Route.patch('/posts/:id/like', 'PostsController.like')
  Route.patch('/posts/:id/unlike', 'PostsController.unlike')

  Route.post('/users/:id/add', 'FriendsController.store')
  Route.delete('/users/:id/remove', 'FriendsController.destroy')
}).middleware('auth:api')
