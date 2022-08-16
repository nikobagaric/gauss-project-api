import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if(await auth.check()) {
      return response.badRequest('Already logged in')
    }
    await next()
  }
}
