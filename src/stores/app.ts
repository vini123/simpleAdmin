import { defineStore } from 'pinia'

export const useApp = defineStore('app', {
    state: () =>({
        collapse: localStorage.getItem('collapse') || false,
        menus: [] as Array<AppRoute.Route>
    }),
    actions: {
        setData(value:Record<string, any>) {
            if (value.collapse !==  undefined) {
                localStorage.setItem('collapse', value.collapse.toString())
                this.collapse = value.collapse.toString() 
            }
        },
        setMenu(value:Array<AppRoute.Route>) {
            this.menus = value
        }
    }
})