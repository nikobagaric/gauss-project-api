import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class OAuthController {
  public async facebookLogin({ ally, auth }: HttpContextContract) {
    const facebook = ally.use('facebook')
    const faceuser = await facebook.user()

    const user = await User.firstOrCreate(
      {
        email: faceuser.email?.toString(),
      },
      {
        username: faceuser.name,
        accesToken: faceuser.token.token,
        isVerified: faceuser.emailVerificationState === 'verified',
      }
    )

    await auth.use('api').login(user)
  }

  public async githubLogin({ ally, auth }: HttpContextContract) {
    const github = ally.use('github')
    const gitUser = await github.user()

    const user = await User.firstOrCreate(
      {
        email: gitUser.email?.toString(),
      },
      {
        username: gitUser.name,
        accesToken: gitUser.token.token,
        isVerified: gitUser.emailVerificationState === 'verified',
      }
    )

    await auth.use('api').login(user)
  }

  public async twitterLogin({ ally, auth }: HttpContextContract) {
    const twitter = ally.use('twitter')
    const twitterUser = await twitter.user()

    const user = await User.firstOrCreate(
      {
        email: twitterUser.email?.toString(),
      },
      {
        username: twitterUser.name,
        accesToken: twitterUser.token.token,
        isVerified: twitterUser.emailVerificationState === 'verified',
      }
    )

    await auth.use('api').login(user)
  }

  public async googleLogin({ ally, auth }: HttpContextContract) {
    const google = ally.use('google')
    const googleUser = await google.user()

    const user = await User.firstOrCreate(
      {
        email: googleUser.email?.toString(),
      },
      {
        username: googleUser.name,
        accesToken: googleUser.token.token,
        isVerified: googleUser.emailVerificationState === 'verified',
      }
    )

    await auth.use('api').login(user)
  }
}
