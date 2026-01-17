'use client';

import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, Alert, SafeAreaView, StatusBar, AppState, Platform, Keyboard } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Product, CartItem, DeviceInfo } from "../types"
import CartSummary from "../components/CartSummary"
import { StorageService } from "../services/StorageService"
import ProductHeader from "../components/ProductHeader"
import ProductSearch from "../components/ProductSearch"
import ProductInfoBar from "../components/ProductInfoBar"
import ProductEmptyState from "../components/ProductEmptyState"
import ProductList from "../components/ProductList"
import { useAudio } from "../hooks/useAudio"
import { useProducts } from "../hooks/useProducts"
import { useCart } from "../hooks/useCart"
import { useTimestamps } from "../hooks/useTimestamps"

interface ProductsScreenProps {
  navigation: any
  onLogout: () => void
}

export default function ProductsScreen({ navigation, onLogout }: ProductsScreenProps) {
  const [produtosFiltrados, setProdutosFiltrados] = useState<Product[]>([])
  const [tendaInfo, setTendaInfo] = useState<string>("")
  const [proprietario, setProprietario] = useState<string>("")
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({ deviceId: "", vendasPendentes: 0, vendasTotal: 0 })
  const [searchText, setSearchText] = useState<string>("")
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [processandoVenda, setProcessandoVenda] = useState(false)
  const [isOnline] = useState<boolean>(true)

  const appStateRef = useRef<string>(AppState.currentState)

  // Custom hooks
  const { produtos, loading, loadProdutos, refreshProdutos } = useProducts()
  const { carrinho, updateQuantidade, getQuantidadeProduto, calcularTotais, clearCarrinho } = useCart(produtos)
  const { setupAudio, playSuccessSound, cleanupAudio } = useAudio()
  const { loadTimestamps, saveProductUpdateTimestamp, formatLastUpdate } = useTimestamps()

  const configureStatusBar = () => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#FFFFFF", true)
      StatusBar.setBarStyle("dark-content", true)
      StatusBar.setTranslucent(false)
      StatusBar.setHidden(false, "none")
    } else {
      StatusBar.setBarStyle("dark-content", true)
      StatusBar.setHidden(false, "none")
    }
  }

  const setupAppStateListener = () => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
        setTimeout(() => {
          configureStatusBar()
        }, 200)
      }

      appStateRef.current = nextAppState
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return subscription
  }

  const setupKeyboardListeners = () => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true)
    })

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false)
    })

    return { keyboardDidShowListener, keyboardDidHideListener }
  }

  const cleanupKeyboardListeners = () => {
    Keyboard.removeAllListeners("keyboardDidShow")
    Keyboard.removeAllListeners("keyboardDidHide")
  }

  useEffect(() => {
    configureStatusBar()
    const appStateSubscription = setupAppStateListener()

    loadProdutos()
    loadTendaInfo()
    loadProprietario()
    loadDeviceInfo()
    loadTimestamps()
    setupAudio()
    setupKeyboardListeners()

    return () => {
      appStateSubscription?.remove()
      cleanupAudio()
      cleanupKeyboardListeners()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        configureStatusBar()
      }, 100)
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    filtrarProdutos()
  }, [searchText, produtos])

  const filtrarProdutos = () => {
    let produtosFiltrados = [...produtos]

    if (searchText.trim()) {
      const textoBusca = searchText.toLowerCase().trim()
      produtosFiltrados = produtos.filter((produto) => {
        const nomeMatch = produto.nome.toLowerCase().includes(textoBusca)
        const idMatch = produto.id ? String(produto.id).toLowerCase().includes(textoBusca) : false

        return nomeMatch || idMatch
      })
    }

    produtosFiltrados.sort((a, b) => {
      return a.nome.toLowerCase().localeCompare(b.nome.toLowerCase(), "pt-BR", {
        sensitivity: "base",
        numeric: true,
      })
    })

    setProdutosFiltrados(produtosFiltrados)
  }

  const loadTendaInfo = async () => {
    const numeroTenda = await AsyncStorage.getItem("numeroTenda")
    setTendaInfo(numeroTenda || "")
  }

  const loadProprietario = async () => {
    const proprietarioData = await AsyncStorage.getItem("proprietario")
    setProprietario(proprietarioData || "")
  }

  const processarVendaBackground = async (carrinhoSnapshot: CartItem[]) => {
    try {
      console.log("Salvando venda localmente")
      await StorageService.salvarVenda(carrinhoSnapshot)
      await loadDeviceInfo()
    } catch (error) {
      console.error("Erro ao salvar venda:", error)
    }
  }

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      Alert.alert("Atencao", "Adicione produtos ao carrinho antes de finalizar a venda")
      return
    }

    if (processandoVenda) {
      return
    }

    const { totalItens, valorTotal } = calcularTotais()

    Alert.alert(
      "Confirmar Venda",
      `Tem certeza que deseja finalizar a venda?\n\n🌾 ${totalItens} itens\n💰 R$ ${valorTotal.toFixed(2)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Finalizar",
          style: "default",
          onPress: async () => {
            try {
              setProcessandoVenda(true)

              const carrinhoSnapshot = [...carrinho]
              clearCarrinho()

              playSuccessSound().catch((error) => {
                console.error("Erro ao reproduzir som:", error)
              })

              Alert.alert("Sucesso!", "Venda finalizada com sucesso! 🎉")

              processarVendaBackground(carrinhoSnapshot).finally(() => {
                setProcessandoVenda(false)
              })
            } catch (error) {
              console.error("Erro ao finalizar venda:", error)
              setProcessandoVenda(false)
              Alert.alert("Erro", "Falha ao finalizar venda")
            }
          },
        },
      ],
    )
  }

  const logout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await cleanupAudio()
          await StorageService.logout()
          onLogout()
        },
      },
    ])
  }

  const loadDeviceInfo = async () => {
    try {
      const info = await StorageService.getDeviceInfo()
      setDeviceInfo(info)
    } catch (error) {
      console.error("Erro ao carregar info do device:", error)
    }
  }

  const clearSearch = () => {
    setSearchText("")
  }

  const handleRefreshProdutos = async () => {
    await refreshProdutos(false)
    await saveProductUpdateTimestamp()
  }

  const { totalItens, valorTotal } = calcularTotais()

  const shouldShowSearchBar = produtos.length > 0
  const shouldShowCartSummary = produtos.length > 0 && !isKeyboardVisible

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} hidden={false} animated={true} />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ProductHeader
            proprietario={proprietario}
            tendaInfo={tendaInfo}
            isOnline={isOnline}
            loading={loading}
            onRefresh={handleRefreshProdutos}
            onLogout={logout}
          />

          {shouldShowSearchBar && (
            <ProductSearch
              searchText={searchText}
              setSearchText={setSearchText}
              clearSearch={clearSearch}
              resultsCount={produtosFiltrados.length}
            />
          )}

          <ProductInfoBar lastUpdateFormatted={formatLastUpdate()} />

          <View style={styles.content}>
            {produtosFiltrados.length === 0 ? (
              <ProductEmptyState searchText={searchText} loading={loading} onRefresh={handleRefreshProdutos} />
            ) : (
              <ProductList
                produtos={produtosFiltrados}
                getQuantidadeProduto={getQuantidadeProduto}
                onUpdateQuantidade={updateQuantidade}
              />
            )}
          </View>

          {shouldShowCartSummary && (
            <CartSummary
              totalItens={totalItens}
              valorTotal={valorTotal}
              onFinalizarVenda={finalizarVenda}
            />
          )}
        </SafeAreaView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F7F3",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#F9F7F3",
  },
})
