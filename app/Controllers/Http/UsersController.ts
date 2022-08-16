import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

/*
Controller for operations with Users
*/

export default class UsersController {
    public async index({ response }: HttpContextContract) {
        // GET all User objects
        return response.ok(await User.all())
    }

    public async store({ request, response }: HttpContextContract) {
        // POST new User object
        const userSchema = schema.create({
            username: schema.string({ trim: true }),
            password: schema.string({}, [rules.minLength(8)]),
            email: schema.string({ trim: true }, [rules.email]),
        })
        const payload = await request.validate({ schema: userSchema })

        const user = await User.create(payload)

        return response.created(user)
    }

    public async show({ params, response }: HttpContextContract) {
        // GET User object by ID
        return response.ok(await User.findOrFail(params.id))
    }

    public async update({ params, request, response }: HttpContextContract) {
        // PUT/PATCH to User object by ID
        const newUserSchema = schema.create({
            username: schema.string({ trim: true }),
            password: schema.string({}, [rules.minLength(8)]),
            email: schema.string({ trim: true }, [rules.email]),
        })
        const payload = await request.validate({ schema: newUserSchema })

        const user = await User.findOrFail(params.id)

        user.merge(payload)
        user.save()

        return response.ok(user)
    }

    public async destroy({ params, response }: HttpContextContract) {
        // DELETE User object by ID
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.ok(user)
    }
}
