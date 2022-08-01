import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class VerificationsController {
    public async index({ response, auth }: HttpContextContract) {
        auth.user?.sendVerificationEmail()
        return response.status(200)
    }

    public async confirm({ response, request, params}: HttpContextContract ) {
        if(request.hasValidSignature()) {
            const user = await User.findByOrFail('email', params.email)
            user.isVerified = true
            user.save()
            return response.status(200)
        } else {
            return response.status(401)
        }
    }
}
