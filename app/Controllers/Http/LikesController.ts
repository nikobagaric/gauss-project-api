import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Like from 'App/Models/Like'

export default class LikesController {
  public async index({ params }: HttpContextContract) {
    const likes = await Like.query().where('post_id', params.id)
    return likes
  }

  public async store({ params, auth, response }: HttpContextContract) {
    const like = new Like()
    like.postId = params.id
    like.userId = auth.user?.id!
    if(await Like.query().where('user_id', auth.user?.id!).first()){
      return response.badRequest('Already liked post')
    }
    like.save()
    return response.ok(like)
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const like = await Like.query()
      .where('post_id', params.id)
      .where('user_id', auth.user?.id!)
      .firstOrFail()

    await like.delete()
    return response.ok('Unliked')
  }
}
