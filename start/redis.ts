/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Redis from '@ioc:Adonis/Addons/Redis'

Redis.subscribe('user:signup', (user: string) =>{
    console.log(JSON.parse(user))
})

Redis.subscribe('user:login', (user: string) =>{
    console.log(JSON.parse(user))
})