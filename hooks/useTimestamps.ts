import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useTimestamps = () => {
  const [lastProductUpdate, setLastProductUpdate] = useState<Date | null>(null)
  const [lastSyncUpdate, setLastSyncUpdate] = useState<Date | null>(null)

  const loadTimestamps = async () => {
    try {
      const productTimestamp = await AsyncStorage.getItem("last_product_update")
      const syncTimestamp = await AsyncStorage.getItem("last_sync_update")

      if (productTimestamp) {
        setLastProductUpdate(new Date(productTimestamp))
      }
      if (syncTimestamp) {
        setLastSyncUpdate(new Date(syncTimestamp))
      }
    } catch (error) {
      console.error("Erro ao carregar timestamps:", error)
    }
  }

  const saveProductUpdateTimestamp = async () => {
    try {
      const now = new Date()
      setLastProductUpdate(now)
      await AsyncStorage.setItem("last_product_update", now.toISOString())
    } catch (error) {
      console.error("Erro ao salvar timestamp de produtos:", error)
    }
  }

  const saveSyncUpdateTimestamp = async () => {
    try {
      const now = new Date()
      setLastSyncUpdate(now)
      await AsyncStorage.setItem("last_sync_update", now.toISOString())
    } catch (error) {
      console.error("Erro ao salvar timestamp de sincronização:", error)
    }
  }

  const formatLastUpdate = () => {
    if (!lastSyncUpdate) return "Nunca"
    const now = new Date()
    const diffMs = now.getTime() - lastSyncUpdate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return "Agora"
    if (diffMinutes < 60) return `${diffMinutes}min atrás`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h atrás`
    return lastSyncUpdate.toLocaleDateString()
  }

  return {
    lastProductUpdate,
    lastSyncUpdate,
    loadTimestamps,
    saveProductUpdateTimestamp,
    saveSyncUpdateTimestamp,
    formatLastUpdate,
  }
}
