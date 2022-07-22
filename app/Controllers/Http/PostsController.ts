import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post'

export default class PostsController {
    public async index({}: HttpContextContract){
        return Post.all()
    }

    public async create({ view }: HttpContextContract) {
        return view.render('posts/create')
    }

    public async store({ request, auth, response}: HttpContextContract) {
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
        post.save()
        return response.redirect(`/${auth.user!.username}`)
    }

    public async show({ params }: HttpContextContract) {
        return Post.findOrFail(params.id)
    }

    public async update({ }: HttpContextContract) {

    }

}
