import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class OAuthController {
  public gitRedirect({ ally }: HttpContextContract) {
    return ally.use('github').redirect()
  }

  public async gitCallback({ ally, auth, session, response }: HttpContextContract) {
    const github = ally.use('github')

    if (github.accessDenied()) {
      session.flash({
        notification: {
          type: 'error',
          message: 'Access was denied.',
        },
      })

      return response.unauthorized('Access denied')
      //return response.redirect('/login')
    }

    if (github.stateMisMatch()) {
      session.flash({
        notification: {
          type: 'error',
          message: 'Request expired. Retry again.',
        },
      })

      return response.unauthorized('Request expired')
      //return response.redirect('/login')
    }

    if (github.hasError()) {
      session.flash({
        notification: {
          type: 'error',
          message: github.getError(),
        },
      })

      return response.badRequest
      //return response.redirect('/login')
    }

    const gitUser = await github.user()

    const user = await User.firstOrCreate(
      {
        email: gitUser.email?.toString(),
      },
      {
        username: gitUser.name,
        provider: 'github',
        providerId: gitUser.id,
        isVerified: gitUser.emailVerificationState === 'verified',
      }
    )

    await auth.use('api').login(user)

    return response.ok
  }

}
