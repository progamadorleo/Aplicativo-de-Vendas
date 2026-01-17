import { useRef } from "react"
import { Audio } from "expo-av"

export const useAudio = () => {
  const soundRef = useRef<Audio.Sound | null>(null)

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })

      const { sound } = await Audio.Sound.createAsync(require("../assets/sommoeda.mp3"), {
        shouldPlay: false,
        isLooping: false,
        volume: 0.8,
      })

      soundRef.current = sound
    } catch (error) {
      console.error("Erro ao configurar áudio:", error)
    }
  }

  const playSuccessSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync()
        await soundRef.current.setPositionAsync(0)
        await soundRef.current.playAsync()
      } else {
        await setupAudio()
      }
    } catch (error) {
      console.error("Erro ao reproduzir som:", error)
    }
  }

  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
        soundRef.current = null
      }
    } catch (error) {
      console.error("Erro ao limpar áudio:", error)
    }
  }

  return {
    setupAudio,
    playSuccessSound,
    cleanupAudio,
  }
}
