import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'

/*
Controller for Friends feature
*/

export default class FriendsController {
  public async index({ auth }: HttpContextContract) {
    const friends = Friend.query().where('user_id', auth.user!.id)

    return friends
  }

  public async store({ params, response, auth }: HttpContextContract) {
    const friend = new Friend()
    friend.userId = auth.user!.id
    friend.friendId = params.user.id

    await friend.save()
    return response.status(200)
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const friend = Friend.query()
      .where('user_id', auth.user!.id)
      .where('following_id', params.userid)

    await friend.delete()
    return response.status(200)
  }
}
