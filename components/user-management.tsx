"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Ban, CheckCircle2, RefreshCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMap, setActionMap] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string>("")

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      // backend supports a limit for recent users; request a sensible batch
      const response = await adminApi.getRecentUsers(50)
      setUsers(response.data.users ?? [])
    } catch (err) {
      console.error("Failed to load users", err)
      setError("Unable to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleToggleBan = async (userId: string, isActive: boolean) => {
    setActionMap((prev) => ({ ...prev, [userId]: true }))
    try {
      if (isActive) {
        await adminApi.banUser(userId)
      } else {
        await adminApi.unbanUser(userId)
      }
      await fetchUsers()
    } catch (err) {
      console.error("Failed to update user", err)
      setError("Unable to update user status. Please try again.")
    } finally {
      setActionMap((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
    }
  }

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((user) => user.isActive).length
    const banned = total - active
    const admins = users.filter((user) => user.role?.toLowerCase().includes("admin")).length
    return { total, active, banned, admins }
  }, [users])

  return (
    <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Users</CardTitle>
          <p className="text-sm text-muted-foreground">
            View user accounts from the admin API and manage access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-xs text-primary">
            {stats.total} total
          </Badge>
          <Badge variant="outline" className="border-emerald-400/40 bg-emerald-400/15 text-xs text-emerald-600">
            {stats.active} active
          </Badge>
          <Badge variant="outline" className="border-border/70 text-xs text-muted-foreground">
            {stats.admins} admin
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCcw size={14} className={cn(loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="text-sm">
                    <TableCell className="font-medium">{user.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 text-xs text-muted-foreground">
                        {user.role || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-destructive/40 text-destructive">
                          Banned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={user.isActive ? "outline" : "default"}
                        size="sm"
                        disabled={Boolean(actionMap[user.id])}
                        className={cn(
                          "gap-2 rounded-xl",
                          user.isActive ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""
                        )}
                        onClick={() => handleToggleBan(user.id, user.isActive)}
                      >
                        {actionMap[user.id] ? (
                          <span className="text-xs">Processing…</span>
                        ) : user.isActive ? (
                          <>
                            <Ban size={14} />
                            Ban
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            Unban
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
