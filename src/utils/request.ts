import Axios from 'axios'

import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from 'axios'

import { stringify } from 'qs'

import { getToken } from '@/utils/auth'

import { useUser } from '@/stores/user'

import router from '@/router'

const { VITE_APP_BASE_API } = import.meta.env

function getUser() {
  return useUser()
}

const defaultConfig: AxiosRequestConfig = {
  baseURL: VITE_APP_BASE_API,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
}

const axios: AxiosInstance = Axios.create(defaultConfig)

axios.interceptors.request.use(
  (config) => {
    const time = new Date().getTime()
    const token = getToken()
    config.headers['Time'] = time
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      getUser().logout()

      if (router.currentRoute.value.path !== '/login') {
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        })
      } else {
        router.push('/login')
      }
    } else {
      if (error.response && error.response.data) {
        showError(error.response.data)
      }
    }
    return Promise.reject(error)
  }
)

interface Error {
  message?: string
  errors?: Record<string, Array<string>>
}

function showError(value: Error) {
  if (value) {
    let message: string = value.message ?? ''
    const errors: Record<string, Array<string>> | undefined = value.errors
    if (errors) {
      for (const key in errors) {
        if (errors[key].length > 0) {
          message = errors[key][0]
          break
        }
      }
    }

    if (message) {
      ElNotification({
        type: 'error',
        title: '',
        message: message,
        duration: 3000
      })
    }
  }
}
export default axios
