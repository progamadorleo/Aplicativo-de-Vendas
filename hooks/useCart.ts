import { useState } from "react"
import type { Product, CartItem } from "../types"

export const useCart = (produtos: Product[]) => {
  const [carrinho, setCarrinho] = useState<CartItem[]>([])

  const updateQuantidade = (produtoId: string, quantidade: number) => {
    setCarrinho((prev) => {
      const existingItem = prev.find((item) => item.produtoId === produtoId)

      if (quantidade === 0) {
        return prev.filter((item) => item.produtoId !== produtoId)
      }

      if (existingItem) {
        return prev.map((item) => (item.produtoId === produtoId ? { ...item, quantidade } : item))
      } else {
        const produto = produtos.find((p) => p.id === produtoId)
        if (produto) {
          const precoUnitario =
            produto.preco_unitario !== undefined
              ? produto.preco_unitario
              : produto.preco !== undefined
                ? produto.preco
                : 0

          return [...prev, { produtoId, quantidade, precoUnitario }]
        }
      }

      return prev
    })
  }

  const getQuantidadeProduto = (produtoId: string): number => {
    const item = carrinho.find((item) => item.produtoId === produtoId)
    return item ? item.quantidade : 0
  }

  const calcularTotais = () => {
    const totalItens = carrinho.reduce((sum, item) => sum + (item.quantidade || 0), 0)
    const valorTotal = carrinho.reduce((sum, item) => {
      const quantidade = item.quantidade || 0
      const preco = item.precoUnitario || 0
      return sum + quantidade * preco
    }, 0)
    return { totalItens, valorTotal }
  }

  const clearCarrinho = () => {
    setCarrinho([])
  }

  return {
    carrinho,
    updateQuantidade,
    getQuantidadeProduto,
    calcularTotais,
    clearCarrinho,
  }
}
