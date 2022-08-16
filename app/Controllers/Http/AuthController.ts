import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

/*
Controller for user authentication
*/

export default class AuthController {
  public async signup({ request, auth, response }: HttpContextContract) {
    // Create new User
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
        ]),
        username: schema.string({}, [
          rules.unique({ table: 'users', column: 'username' }),
          rules.minLength(3),
          rules.maxLength(20),
        ]),
        password: schema.string({}, [rules.minLength(8)]),
      }),
      messages: {
        'email.required': 'Email is required to sign up',
        'username.required': 'Username is required to sign up',
        'password.required': 'Password is required to sign up',
        'password.minLength': 'Password must be at least 8 characters',
      },
    })

    const user = new User()
    user.email = req.email
    user.username = req.username
    user.password = req.password

    await user.save()
    const token = await auth.use('api').login(user, {
      expiresIn: '10 days',
    })

    response.cookie('token', token)
    return token.toJSON()
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })

    response.cookie('token', token)
    return token.toJSON()
  }

  public async logout({ auth, response }: HttpContextContract) {
    // Log out user
    if (!auth.use('api').isLoggedIn) {
      return response.unauthorized('Already logged out')
    }
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
