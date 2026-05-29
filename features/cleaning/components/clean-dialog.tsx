"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Coffee,
  Utensils,
  Trees,
  Waves,
  Mountain,
  Hotel,
  Landmark,
  ShoppingBag,
  Tent,
  Moon,
  Users,
  MapPin,
} from "lucide-react";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

const categories = [
  {
    value: "cafe",
    label: "Cafe",
    icon: Coffee,
  },
  {
    value: "restaurant",
    label: "Restaurant",
    icon: Utensils,
  },
  {
    value: "nature",
    label: "Nature",
    icon: Trees,
  },
  {
    value: "beach",
    label: "Beach",
    icon: Waves,
  },
  {
    value: "mountain",
    label: "Mountain",
    icon: Mountain,
  },
  {
    value: "hotel",
    label: "Hotel",
    icon: Hotel,
  },
  {
    value: "museum",
    label: "Museum",
    icon: Landmark,
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
  },
  {
    value: "camping",
    label: "Camping",
    icon: Tent,
  },
  {
    value: "nightlife",
    label: "Nightlife",
    icon: Moon,
  },
  {
    value: "family",
    label: "Family",
    icon: Users,
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: any;
  onSuccess: () => void;
}

export function CleanDialog({ open, onOpenChange, row, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [showVideo, setShowVideo] = useState(false);

  const [form, setForm] = useState({
    category: "",
    place_name: "",
    address: "",
    city: "",
    province: "",
    country: "Indonesia",
  });

  useEffect(() => {
    if (!row) return;

    setForm({
      category: "",
      place_name: "",
      address: "",
      city: "",
      province: "",
      country: "Indonesia",
    });
  }, [row]);

  if (!row) return null;

  const handleProcess = async () => {
    try {
      setLoading(true);

      const { error: insertError } = await supabase
        .from("cleaned_tiktok_data")
        .insert({
          raw_id: row.id,
          url: row.url,
          caption: row.alt_text,
          views: row.views,

          category: form.category,

          place_name: form.place_name,
          address: form.address,
          city: form.city,
          province: form.province,
          country: form.country,

          confidence: 1,
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("raw_tiktok_data")
        .update({
          cleaning_status: "cleaned",
          extraction_status: "done",
        })
        .eq("id", row.id);

      if (updateError) throw updateError;

      toast.success("Cleaned successfully");

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error("Failed to clean");
    } finally {
      setLoading(false);
    }
  };

  const handleFail = async () => {
    try {
      setLoading(true);

      await supabase
        .from("raw_tiktok_data")
        .update({
          cleaning_status: "rejected",
        })
        .eq("id", row.id);

      toast.success("Marked as rejected");

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  function extractTikTokId(url: string) {
    try {
      const match = url.match(/video\/(\d+)/);
      return match?.[1] ?? "";
    } catch {
      return "";
    }
  }

  const isVideo = row.media_type === "video";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clean TikTok Data</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant="secondary">{row.source_query}</Badge>

                <Badge>{row.media_type || "unknown"}</Badge>
              </div>

              <div className="relative w-full bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-80">
                {isVideo && showVideo ? (
                  <iframe
                    className="w-full aspect-video"
                    src={`https://www.tiktok.com/embed/${extractTikTokId(
                      row.url,
                    )}`}
                    allowFullScreen
                  />
                ) : row.thumbnail_url ? (
                  <img
                    src={row.thumbnail_url}
                    className="w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>

              {isVideo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideo(!showVideo)}
                >
                  {showVideo ? "Show Thumbnail" : "Watch Video"}
                </Button>
              )}

              <div className="space-y-2">
                <Label>Caption</Label>

                <div className="rounded-lg border p-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {row.alt_text || "No caption"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Label>Category</Label>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;

                  const active = form.category === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          category: category.value,
                        }))
                      }
                      className={`
                        flex items-center gap-2 rounded-xl border p-3 text-sm transition-all
                        hover:border-primary hover:bg-muted
                        ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location Name</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Ex: Kopi Nako Dago"
                  className="pl-9"
                  value={form.place_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      place_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>

              <Textarea
                placeholder="Full address"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>

                <Input
                  placeholder="Bandung"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Province</Label>

                <Input
                  placeholder="West Java"
                  value={form.province}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      province: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Country</Label>

              <Input
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="destructive"
                onClick={handleFail}
                disabled={loading}
              >
                Reject
              </Button>

              <Button
                onClick={handleProcess}
                disabled={!form.category || !form.place_name || loading}
              >
                Process Clean
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
