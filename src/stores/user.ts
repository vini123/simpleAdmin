import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login as userLogin, getUserInfo } from '@/api/user'
import { useApp } from './app'
import initRoutes from './utils/router'

export const useUser = defineStore('user', {
    state: () =>({
        token: getToken(),
        accessAbility: false,
        id: '',
        viewid: '',
        nickname: '',
        phone: '',
        avatar: '',
        email: '',
        gender: '',
        signature: '',
        roles: [],
        curRole: ''
    }),
    actions: {
        login(value:LoginData) {
            return new Promise((resolve, reject) => {
                userLogin(value).then((res:Record<string, any>) => {
                    if (res && res['token']) {
                        setToken(res['token'])
                    } else {
                        reject('登录失败')
                    }
                    resolve('')
                }).catch(() => {
                    reject('登录失败')
                })
            })
        },
        logout() {
            removeToken()
        },
        getUserInfo() {
            return new Promise<Array<Record<string, any>>>((resolve, reject) => {
                getUserInfo().then((res:Record<string, any>) => {
                    if (!res) {
                        return reject('Verification failed, please Login again.')
                    }
                    const keys:Array<string> = ['id', 'viewid', 'nickname', 'phone', 'avatar', 'email',  'gender', 'signature', 'roles']
                    keys.forEach(key => {
                        if (Object.prototype.hasOwnProperty.call(res, key)) {
                            this.$patch({[key]: res[key]})
                        }
                    });

                    const menus:Array<Record<string, any>> = res.menus || null
                    resolve(menus)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setRoutes(router:Router, value:Array<any>):boolean {
            const app = useApp()
            app.setMenu(initRoutes(router, value))
            if (app.menus.length > 0) {
                this.accessAbility = true
                return true
            }
            return false
        }
    }
})