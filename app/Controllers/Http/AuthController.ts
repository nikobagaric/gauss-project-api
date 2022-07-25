import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

/*
Controller for user authentication
*/

export default class AuthController {
    public async signup({ request, response }: HttpContextContract) {
        // Create new User
        const req = await request.validate({
            schema: schema.create({
                email: schema.string({}, [rules.email()]),
                username: schema.string({}),
                password: schema.string({}, [rules.minLength(8)]),
            }),
            messages: {
                'email.required': 'Email is required to sign up',
                'username.required': 'Username is required to sign up',
                'password.required': 'Password is required to sign up',
                'password.minLength': 'Password must be at least 8 characters',
            }
        })

        const user = new User()
        user.email = req.email
        user.username = req.username
        user.password = req.password

        await user.save()
        return response.status(201)
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
            }
        })

        const email = req.email
        const password = req.password

        const user = await User
            .query()
            .where('email', email)
            .firstOrFail()

        if(!(await Hash.verify(user.password, password))) {
            return response.unauthorized('Invalid credentials')
        }
        const token = await auth.use('api').generate(user)
        return token
    }

    public async logout({ auth, response }: HttpContextContract) {
        // Log out user
        await auth.logout()
        return response.status(200)
    }
}
