import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
    public async signup({ request, response }: HttpContextContract) {
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

        return response.redirect('/user')
    }

    public async social_signup({ auth, ally }) {
        const github = ally.use('github')

        const githubUser = await github.user()

        const user = await User.firstOrCreate({
          email: githubUser.email,
        }, {
          username: githubUser.name,
          isVerified: githubUser.emailVerificationState === 'verified'
        })

        await auth.use('web').login(user)
    }

    public async login({ request, auth, response }: HttpContextContract) {
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
        const user = await auth.attempt(email, password)

        const token = await auth.use('api').generate(user)

        return response.redirect(`/${user.username}`)
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout()
        return response.redirect('/')
    }
}
