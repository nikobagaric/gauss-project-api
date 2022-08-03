import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

/*
Controller for user authentication
*/

export default class AuthController {
  public async signup({ request, auth }: HttpContextContract) {
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

    return token.toJSON()
  }

  public async login({ request, auth, response }: HttpContextContract) {
    // Authenticate User by email and password, token auth
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
      }),
      messages: {
        'email.required': 'Email is required to log in',
        'password.required': 'Password is required to log in',
      },
    })

    const email = req.email
    const password = req.password

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '10 days',
      })
      return token.toJSON()
    } catch {
      return response.unauthorized('Invalid credentials')
    }
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
