"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api-client"
import { Ban, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function RecentUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getRecentUsers(8)
      setUsers(response.data.users)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUnban = async (userId: string, isActive: boolean) => {
    setActionLoading(userId)
    try {
      if (isActive) {
        await adminApi.banUser(userId)
      } else {
        await adminApi.unbanUser(userId)
      }
      fetchUsers()
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Button
                size="sm"
                variant={user.isActive ? "outline" : "default"}
                onClick={() => handleBanUnban(user.id, user.isActive)}
                disabled={actionLoading === user.id}
                className="ml-2"
              >
                {actionLoading === user.id ? (
                  <span className="text-xs">...</span>
                ) : user.isActive ? (
                  <>
                    <Ban size={14} className="mr-1" />
                    <span className="text-xs">Ban</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} className="mr-1" />
                    <span className="text-xs">Unban</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
