import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'

/*
Controller for Friends feature
*/

export default class FriendsController {
  public async index({ auth, response }: HttpContextContract) {
    const friends = await Friend.query().where('user_id', auth.user!.id)
    return response.ok(friends)
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const friend = await Friend.query()
      .where('user_id', auth.user!.id)
      .where('friend_id', params.id)
      .firstOrFail()
    return response.ok(friend)
  }

  public async store({ params, response, auth }: HttpContextContract) {
    const friend = new Friend()
    friend.userId = auth.user!.id

    const user = await User.findByOrFail('id', params.id)

    friend.friendId = user.id

    await friend.save()
    return response.created(friend)
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const friend = await Friend.query()
      .where('user_id', auth.user!.id)
      .where('friend_id', params.id)
      .firstOrFail()

    await friend!.delete()
    return response.ok('Friend removed')
  }
}
