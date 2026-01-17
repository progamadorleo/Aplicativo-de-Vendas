import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Sale, CartItem, Product } from "../types"
import { MOCK_PRODUCTS, MOCK_USER } from "../data/mockProducts"

export class StorageService {
  static async login(numeroTenda: string, senha: string): Promise<{ success: boolean; message?: string; produtos?: Product[] }> {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (numeroTenda === MOCK_USER.numeroTenda && senha === MOCK_USER.senha) {
      await AsyncStorage.setItem("token", "mock_token_123")
      await AsyncStorage.setItem("codigo_tenda", numeroTenda)
      await AsyncStorage.setItem("proprietario", MOCK_USER.proprietario)
      await AsyncStorage.setItem("produtos", JSON.stringify(MOCK_PRODUCTS))
      
      return {
        success: true,
        produtos: MOCK_PRODUCTS,
      }
    }

    return {
      success: false,
      message: "Credenciais invalidas. Use tenda: 123, senha: 123",
    }
  }

  static async getProdutos(): Promise<Product[]> {
    const produtosData = await AsyncStorage.getItem("produtos")
    if (produtosData) {
      return JSON.parse(produtosData)
    }
    return MOCK_PRODUCTS
  }

  static async salvarVenda(carrinho: CartItem[]): Promise<void> {
    const venda: Sale = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      data: new Date().toISOString(),
      produtos: carrinho,
      valorTotal: carrinho.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0),
      deviceId: "local_device",
      syncStatus: "pending",
    }

    const vendasExistentes = await this.getVendasLocais()
    const novasVendas = [...vendasExistentes, venda]
    await AsyncStorage.setItem("vendas", JSON.stringify(novasVendas))
  }

  static async getVendasLocais(): Promise<Sale[]> {
    const vendasData = await AsyncStorage.getItem("vendas")
    return vendasData ? JSON.parse(vendasData) : []
  }

  static async getQuantidadeVendasPendentes(): Promise<number> {
    const vendas = await this.getVendasLocais()
    return vendas.filter(v => v.syncStatus === "pending").length
  }

  static async getDeviceInfo(): Promise<{ deviceId: string; vendasPendentes: number; vendasTotal: number }> {
    const vendas = await this.getVendasLocais()
    const pendentes = vendas.filter(v => v.syncStatus === "pending").length
    
    return {
      deviceId: "local_device",
      vendasPendentes: pendentes,
      vendasTotal: vendas.length,
    }
  }

  static async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      "produtos",
      "numeroTenda",
      "token",
      "codigo_tenda",
      "proprietario",
      "vendas",
      "last_product_update",
      "last_sync_update",
    ])
  }
}
