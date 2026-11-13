import { apiClient } from './client'

export interface UserSearchResult {
  id: string
  email: string
  fullName: string
}

export const usersApi = {
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    const response = await apiClient.get<{ data: UserSearchResult[] }>(
      `/users/search?q=${encodeURIComponent(query)}`
    )
    return response.data.data
  },
}
