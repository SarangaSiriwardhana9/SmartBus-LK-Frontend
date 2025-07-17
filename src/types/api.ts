/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/api.ts
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  statusCode?: number
  error?: string
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}