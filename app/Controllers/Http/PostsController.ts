import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post'

/*
Controller for operations with Posts
*/

export default class PostsController {
    public async index({ response }: HttpContextContract) {
        // GET all Posts
        return response.ok(await Post.all())
    }

    public async store({ request, auth, response }: HttpContextContract) {
        // POST new Post object
        const req = await request.validate({
            schema: schema.create({
                title: schema.string({}),
                description: schema.string({}),
                image: schema.file.nullableAndOptional({
                    size: '8mb',
                    extnames: ['jpg', 'png', 'jpeg', 'svg'],
                })
            }),
            messages: {
                'title.required': 'Title field is required',
                'description.required': 'Description field is required',
            },
        })

        const imageName = new Date().getTime().toString() + `.${req.image?.extname}`
        await req.image?.move(Application.publicPath('images'), {
            name: imageName
        })

        const post = new Post()
        post.image = `images/${imageName}`
        post.title = req.title
        post.userId = auth.user!.id

        await post.save()
        return response.created(post)
    }

    public async show({ params, response }: HttpContextContract) {
        // GET Post by id
        return response.ok(await Post.findOrFail(params.id))
    }

    public async update({ request, params, response }: HttpContextContract) {
        // PUT/PATCH Post by id
        const post = await Post.findOrFail(params.id)
        post.title = request.input('title')
        post.description = request.input('description')
        const image = request.file('image')
        if (image) {
            const imageName = new Date().getTime().toString() + `.${image.extname}`
            await image.move(Application.publicPath('images'), {
                name: imageName
            })
            post.image = `images/${imageName}`
        }

        await post?.save()
        return response.ok(post)
    }

    public async destroy({ params, auth, response }: HttpContextContract) {
        const post = await Post.query()
            .where('user_id', auth.user?.id!)
            .where('id', params.id)
            .firstOrFail()
        post.delete()
        return response.ok('Post deleted')
    }
}
