// Collection types
export interface Collection {
  id: string
  name: string
  schema?: Record<string, any>
  indexes?: Record<string, any>
  options?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CollectionStats {
  name: string
  documentCount: number
  size: number
  indexes: number
}

export interface CreateCollectionRequest {
  name: string
  schema?: Record<string, any>
  indexes?: Record<string, any>
  options?: Record<string, any>
}

export interface UpdateCollectionRequest {
  schema?: Record<string, any>
  indexes?: Record<string, any>
  options?: Record<string, any>
}

export interface BulkOperation {
  action: 'create' | 'update' | 'delete'
  data?: Record<string, any>
  query?: Record<string, any>
}

export interface BulkOperationRequest {
  operations: BulkOperation[]
}

export interface BulkOperationResponse {
  success: boolean
  results: Array<{
    success: boolean
    data?: any
    error?: string
  }>
  total: number
  successful: number
  failed: number
}
