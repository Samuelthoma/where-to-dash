"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import {
    scrapeSchema,
    ScrapeSchema,
} from "../schemas/scrape.schema"

import { useScrapeTikTok } from "../hooks/use-scrape-tiktok"

import { ScrapeResponse } from "@/types/scraping"

interface ScrapeFormProps {
    onSuccess: (
        data: ScrapeResponse
    ) => void
    onLoadingChange?: (
        loading: boolean
    ) => void
}

export function ScrapeForm({
    onSuccess,
    onLoadingChange
}: ScrapeFormProps) {
    const mutation = useScrapeTikTok()

    const form = useForm<ScrapeSchema>({
        resolver: zodResolver(scrapeSchema),

        defaultValues: {
            query: "",
            limit: 10,
        },
    })

    async function onSubmit(
        values: ScrapeSchema
    ) {
        onLoadingChange?.(true)
        try {
            const result =
                await mutation.mutateAsync(values)

            onSuccess(result)
        } catch (error) {
            console.error(error)
        } finally {
            onLoadingChange?.(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    TikTok Scraper
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Query
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Query Keyword"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Limit
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full"
                        >
                            {mutation.isPending
                                ? "Scraping..."
                                : "Start Scraping"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}