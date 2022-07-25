import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'

/*
Controller for Friends feature
*/

export default class FriendsController {
    public async store({ params, response, auth }: HttpContextContract) {
        if(!auth.isLoggedIn) {
            return response.status(401)
        }

        const friend = new Friend
        friend.userId = auth.user!.id
        friend.friendId = params.user.id

        await friend.save()
        return response.status(200)
    }

    public async destroy({ params, response, auth }) {
        if(!auth.isLoggedIn) {
            return response.status(401)
        }

        const friend = Friend
            .query()
            .where('user_id', auth.user!.id)
            .where('following_id', params.user_id)

        await friend.delete()
        return response.status(200)
    }
}
