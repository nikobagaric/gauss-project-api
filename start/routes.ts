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

Route.post('/signup', 'AuthController.signup')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout').middleware('auth')
Route.get('/verify-email/:email', 'VerificationsController.confirm').as('verifyEmail')

Route.get('/github/callback', 'OAuthController.githubLogin')
Route.get('/google/callback', 'OAuthController.googleLogin')
Route.get('/twitter/callback', 'OAuthController.twitterLogin')
Route.get('/facebook/callback', 'OAuthController.facebookLogin')

Route.get('/users', 'UsersController.index')
Route.get('/users/id', 'UserController.show')
Route.put('/users/id', 'UsersController.update').middleware('auth')

Route.get('/posts', 'PostsController.index').middleware('auth')
Route.get('/posts/id', 'PostsController.show').middleware('auth')
Route.post('/posts', 'PostsController.store').middleware('auth')
Route.put('/posts/id', 'PostsController.update').middleware('auth')
Route.delete('/posts/id', 'PostsController.destroy').middleware('auth')
Route.patch('/posts/like', 'PostsController.like').middleware('auth')
Route.patch('/posts/unlike', 'PostsController.unlike').middleware('auth')

Route.post('/friend/:userid', 'FriendsController.store').middleware('auth')
Route.delete('/friend/:userid', 'FriendsController.destroy').middleware('auth')
