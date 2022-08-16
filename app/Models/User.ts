import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import Post from './Post'
import Friend from './Friend'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public provider: string

  @column()
  public providerId: string

  @column()
  public accessToken: string

  @column()
  public rememberMeToken?: string

  @column()
  public description: string

  @column()
  public isVerified: boolean = false

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Friend)
  public friends: HasMany<typeof Friend>

  @hasMany(() => Post)
  public likedPosts: HasMany<typeof Post>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password!)
    }
  }

  public async sendVerificationEmail() {
    const url =
      Env.get('APP_URL') +
      Route.makeSignedUrl('verifyEmail', { params: { email: this.email }, expiresIn: '30m' })
    Mail.send((message) => {
      message
        .from('niko@nulldesign.org')
        .to(this.email)
        .subject(`Please verify your email`, url)
    })
  }
}
