"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Cpu, ShieldCheck, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { adminApi } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface ModelEntry {
  id: number
  modelName: string
  modelKey: string
  baseUrl: string
  apiKey: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ActiveModels() {
  const [chatModels, setChatModels] = useState<ModelEntry[]>([])
  const [planModels, setPlanModels] = useState<ModelEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [actionMap, setActionMap] = useState<Record<string, boolean>>({})

  const fetchModels = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [chatResponse, planResponse] = await Promise.all([
        adminApi.getChatModels(),
        adminApi.getPlanModels(),
      ])
      setChatModels(chatResponse.data?.models ?? [])
      setPlanModels(planResponse.data?.models ?? [])
    } catch (err) {
      console.error("Failed to load models", err)
      setError("Unable to sync model catalogue from the admin APIs.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchModels()
  }, [fetchModels])

  const stats = useMemo(() => {
    const allModels = [...chatModels, ...planModels]
    const active = allModels.filter((model) => model.isActive).length
    const total = allModels.length
    const inactive = total - active
    return { total, active, inactive }
  }, [chatModels, planModels])

  const handleToggle = async (family: "chat" | "plan", model: ModelEntry) => {
    const key = `${family}-${model.id}`
    setActionMap((prev) => ({ ...prev, [key]: true }))
    setError("")
    try {
      if (family === "chat") {
        await adminApi.updateChatModel(model.id, { isActive: !model.isActive })
      } else {
        await adminApi.updatePlanModel(model.id, { isActive: !model.isActive })
      }
      await fetchModels()
    } catch (err) {
      console.error("Failed to toggle model", err)
      setError("Unable to update model status. Please try again.")
    } finally {
      setActionMap((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const renderModels = (family: "chat" | "plan", models: ModelEntry[]) => {
    if (loading) {
      return (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`${family}-skeleton-${index}`}
              className="h-24 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </div>
      )
    }

    if (models.length === 0) {
      return (
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground">
          No {family} models registered yet.
        </div>
      )
    }

    const sorted = [...models].sort((a, b) => Number(b.isActive) - Number(a.isActive))

    return (
      <div className="space-y-3">
        {sorted.map((model) => {
          const key = `${family}-${model.id}`
          const isProcessing = Boolean(actionMap[key])

          return (
            <div
              key={model.id}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/20">
                <Cpu size={18} />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{model.modelName}</p>
                  <Badge
                    variant={model.isActive ? "default" : "outline"}
                    className={cn(
                      "rounded-xl text-[11px] uppercase tracking-wide",
                      model.isActive
                        ? "bg-emerald-500/20 text-emerald-600"
                        : "border-border/60 text-muted-foreground"
                    )}
                  >
                    {model.isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {model.modelKey} • {model.baseUrl.replace(/^https?:\/\//, "")}
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Updated {new Date(model.updatedAt).toLocaleDateString()} • Created{" "}
                  {new Date(model.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={model.isActive}
                  onCheckedChange={() => void handleToggle(family, model)}
                  disabled={isProcessing}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isProcessing}
                  className={cn(
                    "rounded-xl border border-border/50 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5",
                    model.isActive
                      ? "hover:border-primary/40 hover:bg-primary/10"
                      : "hover:border-border/60 hover:bg-muted/40"
                  )}
                  onClick={() => void handleToggle(family, model)}
                >
                  {isProcessing ? "Updating..." : model.isActive ? "Disable" : "Activate"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl transition-all duration-500 hover:-translate-y-1">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck size={20} />
          </span>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Active models
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Review and toggle model availability using the admin model APIs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-xl border-primary/30 bg-primary/10 text-xs text-primary"
          >
            {stats.active} active
          </Badge>
          <Badge
            variant="outline"
            className="rounded-xl border-border/60 text-xs text-muted-foreground"
          >
            {stats.inactive} inactive
          </Badge>
          <Badge
            variant="outline"
            className="rounded-xl border-border/60 text-xs text-muted-foreground"
          >
            {stats.total} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-xl border-primary/30 bg-primary/10 text-xs text-primary"
              >
                Chat models
              </Badge>
              <span className="text-xs text-muted-foreground">
                {chatModels.filter((model) => model.isActive).length} active of{" "}
                {chatModels.length}
              </span>
            </div>
            {renderModels("chat", chatModels)}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-xl border-accent/40 bg-accent/10 text-xs text-accent-foreground"
              >
                Plan models
              </Badge>
              <span className="text-xs text-muted-foreground">
                {planModels.filter((model) => model.isActive).length} active of{" "}
                {planModels.length}
              </span>
            </div>
            {renderModels("plan", planModels)}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground"></div>
      </CardContent>
    </Card>
  );
}
