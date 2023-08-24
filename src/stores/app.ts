import { defineStore } from 'pinia'
interface AppState {
    collapse: string,
    isPhone: boolean,
    logo: string,
    title: string,
    menus: Array<AppRoute.Route>
    routeNames: Array<string>
}

export const useApp = defineStore('app', {
    state: (): AppState =>({
        collapse: localStorage.getItem('collapse') || 'false',
        isPhone: false,
        logo: '',
        title: '',
        menus: [] as Array<AppRoute.Route>,
        routeNames: [] as Array<string>
    }),
    getters: {
        sidebarCollapse: (state):boolean => {
            return state.collapse === 'true'
        }
    },
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
        setMenu(value:AppRoute.InitRoutesData) {
            this.menus = value.menus
            this.routeNames = value.routeNames
        }
    }
})