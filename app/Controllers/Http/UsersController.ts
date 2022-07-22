import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        return User.all()
    }

    public async store({ request, response}: HttpContextContract) {
        const userSchema = schema.create({
            username: schema.string({ trim: true }),
            password: schema.string({}, [rules.minLength(8)]),
            email: schema.string({ trim: true }, [rules.email]),
        })
        const payload = await request.validate({ schema: userSchema })

        const user = await User.create(payload)

        response.status(201)
        return user
    }

    public async show({ params }: HttpContextContract) {
        return User.findOrFail(params.id)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const newUserSchema = schema.create({
            username: schema.string({ trim: true }),
            password: schema.string({}, [rules.minLength(8)]),
            email: schema.string({ trim: true }, [rules.email]),
        })
        const payload = await request.validate({ schema: newUserSchema })

        const user = await User.findOrFail(params.id)

        user.merge(payload)

        response.status(200)
        return user.save()
    }

    public async destroy({ params }: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        return user.delete()
    }
}
