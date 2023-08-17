import { defineStore } from 'pinia'
interface AppState {
    collapse: string,
    isPhone: boolean,
    logo: string,
    title: string,
    menus: Array<AppRoute.Route>
}

export const useApp = defineStore('app', {
    state: (): AppState =>({
        collapse: localStorage.getItem('collapse') || 'false',
        isPhone: false,
        logo: '',
        title: '',
        menus: [] as Array<AppRoute.Route>
    }),
    actions: {
        setData(value:Record<string, any>) {
            if (value.collapse !==  undefined) {
                localStorage.setItem('collapse', value.collapse.toString())
                this.collapse = value.collapse.toString() 
            }

            const keys:Array<string> = ['isPhone']
            keys.forEach(key => {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    this.$patch({[key]: value[key]})
                }
            });
        },
        setMenu(value:Array<AppRoute.Route>) {
            this.menus = value
        }
    }
})