import { describe, it, expect } from 'vitest'
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/api'

describe('API Configuration', () => {
  it('should have correct API base URL for development', () => {
    // En desarrollo debería apuntar a localhost
    expect(API_CONFIG.BASE_URL).toContain('localhost:8080')
  })

  it('should build API URLs correctly', () => {
    const endpoint = '/productos'
    const fullUrl = buildApiUrl(endpoint)
    expect(fullUrl).toBe(`${API_CONFIG.BASE_URL}${endpoint}`)
  })

  it('should include auth headers when token exists', () => {
    // Mock localStorage
    const mockToken = 'fake-jwt-token'
    localStorage.setItem('authToken', mockToken)
    
    const headers = getAuthHeaders()
    expect(headers.Authorization).toBe(`Bearer ${mockToken}`)
    expect(headers['Content-Type']).toBe('application/json')
    
    // Cleanup
    localStorage.removeItem('authToken')
  })

  it('should not include auth header when no token exists', () => {
    localStorage.removeItem('authToken')
    
    const headers = getAuthHeaders()
    expect(headers.Authorization).toBeUndefined()
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('should have correct timeout configuration', () => {
    expect(API_CONFIG.TIMEOUT).toBe(10000)
  })
})