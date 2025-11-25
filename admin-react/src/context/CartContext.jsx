import React, { useState, useContext } from 'react'
import { API_CONFIG, getAuthHeaders } from '../config/api'

// Contexto para manejar el carrito de compras
export const CartContext = React.createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Agrega un producto al carrito, verifica disponibilidad antes
  const addToCart = async (producto, cantidad = 1) => {
    try {
      setLoading(true)
      
  // Consulta al backend si hay stock suficiente
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/productos/${producto.codigo}/disponibilidad?cantidad=${cantidad}`,
        {
          headers: getAuthHeaders()
        }
      )
      
      const availability = await response.json()
      
      if (!availability.disponible) {
        throw new Error('Producto no disponible en la cantidad solicitada')
      }

  // Si el producto ya está en el carrito, suma la cantidad
      const existingItem = cartItems.find(item => item.producto.codigo === producto.codigo)
      
      if (existingItem) {
  // Actualiza la cantidad si ya existe
        setCartItems(cartItems.map(item =>
          item.producto.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        ))
      } else {
  // Si no existe, agrega el producto al carrito
        setCartItems([...cartItems, { 
          producto, 
          cantidad, 
          subtotal: producto.precio * cantidad 
        }])
      }
      
      return true
    } catch (error) {
  // Si ocurre un error al agregar, lo lanza para mostrarlo en la interfaz
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Elimina un producto del carrito
  const removeFromCart = (productoCodigo) => {
    setCartItems(cartItems.filter(item => item.producto.codigo !== productoCodigo))
  }

  // Cambia la cantidad de un producto en el carrito
  const updateQuantity = async (productoCodigo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(productoCodigo)
      return
    }

    try {
      const item = cartItems.find(item => item.producto.codigo === productoCodigo)
      if (!item) return

  // Consulta al backend si hay stock suficiente para la nueva cantidad
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/productos/${productoCodigo}/disponibilidad?cantidad=${nuevaCantidad}`,
        {
          headers: getAuthHeaders()
        }
      )
      
      const availability = await response.json()
      
      if (!availability.disponible) {
        throw new Error('Cantidad no disponible')
      }

      setCartItems(cartItems.map(item =>
        item.producto.codigo === productoCodigo
          ? { 
              ...item, 
              cantidad: nuevaCantidad,
              subtotal: item.producto.precio * nuevaCantidad
            }
          : item
      ))
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([])
  }

  // Calcular total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0)
  }

  // Calcular cantidad total de items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0)
  }

  // Procesar checkout
  const checkout = async (direccionEnvio) => {
    try {
      setLoading(true)

      const pedidoData = {
        items: cartItems.map(item => ({
          productoCodigo: item.producto.codigo,
          cantidad: item.cantidad,
          precio: item.producto.precio
        })),
        direccionEnvio
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/pedidos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pedidoData)
      })

      if (!response.ok) {
        throw new Error('Error procesando el pedido')
      }

      const pedido = await response.json()
      clearCart()
      
      return pedido
    } catch (error) {
      console.error('Error in checkout:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    checkout,
    loading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}