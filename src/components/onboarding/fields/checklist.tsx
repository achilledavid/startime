"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { AnswersFromChecklist } from "../render"
import { isEmpty } from "lodash"

export interface ChecklistItem {
    id: string
    text: string
}

interface ChecklistCreatorProps {
    checklistId?: number | null
    className?: string
    onCreate?: (id: number) => void
}

export default function ChecklistField({ checklistId, className, onCreate }: ChecklistCreatorProps) {
    const { data, isPending } = trpc.checklist.get.useQuery({ id: checklistId || -1 }, {
        retry: false,
    })
    const [items, setItems] = useState<ChecklistItem[]>([])
    const [newItemText, setNewItemText] = useState("")
    const createChecklist = trpc.checklist.post.useMutation({
        onSuccess: (data) => {
            onCreate?.(data.data.id)
        },
        onError: (error) => {
            console.error("Error creating checklist:", error)
        },
    })

    const updateChecklist = trpc.checklist.put.useMutation()

    function addItem() {
        if (newItemText.trim()) {
            const newItem: ChecklistItem = {
                id: Date.now().toString(),
                text: newItemText.trim(),
            }
            setItems([...items, newItem])
            setNewItemText("")
        }
    }

    function deleteItem(id: string) {
        setItems(items.filter((item) => item.id !== id))
    }

    function updateItem(id: string, newText: string) {
        setItems(items.map((item) => (item.id === id ? { ...item, text: newText } : item)))
    }

    function handleSave() {
        if (checklistId) {
            updateChecklist.mutate({
                id: checklistId,
                items: items.map((item) => ({
                    id: item.id,
                    text: item.text,
                })),
            })
            return
        }

        createChecklist.mutate({
            items: items.map((item) => ({
                id: item.id,
                text: item.text,
            })),
        })
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            addItem()
        }
    }

    const canSave = items.length > 0

    useEffect(() => {
        if (checklistId && !isPending) {
            if (data && data.data.answers) {
                const answers: AnswersFromChecklist = data.data.answers as AnswersFromChecklist;
                setItems(answers.map((item: ChecklistItem) => ({
                    id: item.id,
                    text: item.text,
                })))
            } else {
                setItems([])
            }
        }
    }, [checklistId, data, isPending])

    return (
        <Card className={className}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Add a new item</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button onClick={addItem} size="icon" disabled={!newItemText.trim()}>
                            <Plus />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {!isEmpty(items) && (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground min-w-4">{index + 1}.</span>
                                    <Input
                                        value={item.text}
                                        onChange={(e) => updateItem(item.id, e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Button type="button" onClick={handleSave} disabled={!canSave || isPending || updateChecklist.isPending}>
                    Save
                </Button>
            </CardContent>
        </Card>
    )
}
