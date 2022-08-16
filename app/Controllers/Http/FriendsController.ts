import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'

/*
Controller for Friends feature
*/

export default class FriendsController {
  public async index({ auth }: HttpContextContract) {
    const friends = await Friend.query().where('user_id', auth.user!.id)
    return friends
  }

  public async show({ params, auth }: HttpContextContract) {
    const friend = await Friend.query()
      .where('user_id', auth.user!.id)
      .where('friend_id', params.id)
      .firstOrFail()
    return friend
  }

  public async store({ params, response, auth }: HttpContextContract) {
    const friend = new Friend()
    friend.userId = auth.user!.id

    const user = await User.findByOrFail('id', params.id)

    friend.friendId = user.id

    await friend.save()
    return response.status(200)
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const friend = await Friend.query()
      .where('user_id', auth.user!.id)
      .where('friend_id', params.id)
      .firstOrFail()

    await friend!.delete()
    return response.status(200)
  }
}
