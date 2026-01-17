'use client';

import { useState } from "react"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageService } from "../services/StorageService"
import type { Product } from "../types"

export const useProducts = () => {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const loadProdutos = async () => {
    try {
      const produtosData = await AsyncStorage.getItem("produtos")
      if (produtosData) {
        const produtosParsed = JSON.parse(produtosData)
        setProdutos(produtosParsed)
      } else {
        const produtosMock = await StorageService.getProdutos()
        setProdutos(produtosMock)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const refreshProdutos = async (silencioso = false) => {
    if (loading) {
      return
    }

    setLoading(true)
    try {
      const novosProdutos = await StorageService.getProdutos()

      setProdutos(novosProdutos)
      await AsyncStorage.setItem("produtos", JSON.stringify(novosProdutos))

      if (!silencioso) {
        if (novosProdutos.length === 0) {
          Alert.alert("Aviso", "Nenhum produto encontrado.")
        } else {
          Alert.alert("Sucesso", `${novosProdutos.length} produtos atualizados!`)
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error)
      if (!silencioso) {
        Alert.alert("Erro", "Falha ao atualizar produtos")
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    produtos,
    loading,
    loadProdutos,
    refreshProdutos,
  }
}
