import { defineStore } from 'pinia'
// @ts-ignore
import localforage from 'localforage'

export const APP_STORAGE = defineStore('storage', {
  state: () => ({
    personal: localforage.createInstance({
      driver: localforage.INDEXEDDB,
      name: 'personal',
      storeName: 'kv'
    })
  }),
  actions: {
    async setPersonal(key: string, value: any) {
      await this.personal.setItem(key, value)
    },
    async gainPersonal(key: string, defaultValue: any) {
      let value = await this.personal.getItem(key)
      return value || defaultValue
    },
    async removePersonal(key: string) {
      let result = await this.personal.removeItem(key)
      return result
    },
    async clearPersonal(key: string, defaultValue: any) {
      let value = await this.personal.clear()
      return value || defaultValue
    }
  }
})