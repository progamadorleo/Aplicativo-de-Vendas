export interface Product {
  id: string
  nome: string
  preco?: number
  preco_unitario?: number
}

export interface CartItem {
  produtoId: string
  quantidade: number
  precoUnitario: number
}

export interface Sale {
  id: string
  data: string
  produtos: CartItem[]
  valorTotal: number
  deviceId: string 
  syncStatus?: "pending" | "synced" | "error"
}

export interface LoginResponse {
  success: boolean
  message?: string
  produtos?: Product[]
}

export interface DeviceInfo {
  deviceId: string
  vendasPendentes: number
  vendasTotal: number
}
