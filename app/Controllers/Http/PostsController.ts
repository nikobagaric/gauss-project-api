import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post'

/*
Controller for operations with Posts
*/

export default class PostsController {
    public async index({ }: HttpContextContract) {
        // GET all Posts
        return Post.all()
    }

    public async store({ request, auth }: HttpContextContract) {
        // POST new Post object
        auth.use('api').authenticate
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
        return post
    }

    public async show({ params }: HttpContextContract) {
        // GET Post by id
        return Post.findOrFail(params.id)
    }

    public async update({ request, params }: HttpContextContract) {
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
        return post
    }

    public async destroy({ params, auth }: HttpContextContract) {
        const user = await auth.authenticate()
        const post = await Post.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .delete()
        return
    }

    /* public async create({ view }: HttpContextContract) {
        return view.render('posts/create')
    } */
}
