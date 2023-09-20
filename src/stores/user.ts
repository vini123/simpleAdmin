import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login as userLogin, register as userRegister, getUserInfo } from '@/api/personal'
import { useApp } from './app'
import initRoutes from './utils/router'

interface UserState {
    token: string;
    accessAbility: boolean;
    id: number;
    viewid: number;
    nickname: string;
    phone:string;
    avatar: string;
    email: string;
    gender: number;
    signature: string;
    roles: Array<UserRole>;
    curRole: string;
    adminLock: boolean;
}

export const useUser = defineStore('user', {
    state: (): UserState =>({
        token: getToken(),
        accessAbility: false,
        id: 0,
        viewid: 0,
        nickname: '',
        phone: '',
        avatar: '',
        email: '',
        gender: 0,
        signature: '',
        roles: [],
        curRole: '',
        adminLock: false
    }),
    actions: {
        login(value:any) {
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
        register(value:any) {
            return new Promise((resolve, reject) => {
                userRegister(value).then((res:Record<string, any>) => {
                    if (res && res['token']) {
                        setToken(res['token'])
                    } else {
                        reject('注册失败')
                    }
                    resolve('')
                }).catch(() => {
                    reject('注册失败')
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
                    const keys:Array<string> = ['id', 'viewid', 'nickname', 'phone', 'avatar', 'email',  'gender', 'signature', 'roles', 'curRole', 'adminLock']
                    keys.forEach(key => {
                        if (Object.prototype.hasOwnProperty.call(res, key)) {
                            this.$patch({[key]: res[key]})
                        }
                    });

                    const roles:Array<UserRole> = []
                    for(const item of res['roles']) {
                        if (item.name && item.title) {
                            roles.push({
                                name: item.name,
                                title: item.title
                            })
                        }
                    }
                    this.$patch({ 'roles': roles })

                    const menus:Array<Record<string, any>> = res.menus || null
                    resolve(menus)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        refreshUserInfo() {
            getUserInfo().then((res:Record<string, any>) => {
                if (!res) {
                    return
                }
                
                const keys:Array<string> = ['id', 'viewid', 'nickname', 'phone', 'avatar', 'email',  'gender', 'signature', 'roles', 'curRole', 'adminLock']
                keys.forEach(key => {
                    if (Object.prototype.hasOwnProperty.call(res, key)) {
                        this.$patch({[key]: res[key]})
                    }
                });
            })
        },
        setUserInfo(value:Record<string, any>) {
            const keys:Array<string> = ['nickname', 'avatar', 'email',  'gender', 'signature', 'roles', 'curRole', 'adminLock']
            keys.forEach(key => {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    this.$patch({[key]: value[key]})
                }
            });
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