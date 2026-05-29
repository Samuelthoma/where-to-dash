"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { CleanedTikTokData } from "@/types/cleaned-data";
import { categories } from "@/types/categories";
import {
  ExternalLink,
  Sparkles,
  MapPin,
  Loader2,
  Tag,
  Map,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { useUpdateCleanedData } from "../hooks/useUpdateCleanedData";
import { useDeleteCleanedData } from "../hooks/useDeleteCleanedData";

interface CleanedDataTableProps {
  data?: CleanedTikTokData[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function CleanedDataTable({
  data = [],
  isLoading,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}: CleanedDataTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ category: "", address: "" });

  const [itemToDelete, setItemToDelete] = useState<CleanedTikTokData | null>(
    null,
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const { mutateAsync: updateItem, isPending: isUpdating } =
    useUpdateCleanedData();
  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useDeleteCleanedData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/20">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary/60" />
        <p className="text-sm font-medium text-foreground">
          Loading cleaned data...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/20">
        <Sparkles className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">
          No cleaned data yet
        </p>
        <p className="text-sm text-muted-foreground">
          Process some raw data in the queue to see it here.
        </p>
      </div>
    );
  }

  const handleStartEdit = (row: CleanedTikTokData) => {
    setEditingId(row.id);
    setEditForm({
      category: row.category,
      address: row.address || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ category: "", address: "" });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateItem({ id, updates: editForm });
      toast.success("Updated successfully");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update data");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete.id);
      toast.success("Deleted successfully");
      setItemToDelete(null);
    } catch (error) {
      toast.error("Failed to delete data");
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                Location
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Category
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Address
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => {
              const isEditing = editingId === row.id;
              const categoryData = categories.find(
                (c) => c.value === row.category,
              );
              const CategoryIcon = categoryData?.icon || Tag;

              return (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium align-top py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-foreground font-semibold">
                        <MapPin className="h-4 w-4 text-primary" />
                        {row.place_name || "Unknown Place"}
                      </span>
                      {(row.city || row.province) && (
                        <span className="text-xs text-muted-foreground ml-5.5 font-normal">
                          {[row.city, row.province].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="align-top py-4">
                    {isEditing ? (
                      <Select
                        value={editForm.category}
                        onValueChange={(value) =>
                          setEditForm((prev) => ({ ...prev, category: value }))
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="h-9 w-40 bg-background">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => {
                            const Icon = c.icon;
                            return (
                              <SelectItem key={c.value} value={c.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                  <span>{c.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200 gap-1.5 font-medium whitespace-nowrap"
                      >
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {categoryData?.label || row.category}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="align-top py-4">
                    {isEditing ? (
                      <Input
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Enter full address..."
                        className="min-w-62.5 h-9"
                        disabled={isUpdating}
                      />
                    ) : (
                      <div
                        className="max-w-62.5 sm:max-w-87.5 truncate text-slate-600 text-sm"
                        title={row.address ?? "No address"}
                      >
                        <div className="flex items-center gap-2">
                          <Map className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{row.address ?? "—"}</span>
                        </div>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right align-top py-4">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="default"
                          onClick={() => handleSaveEdit(row.id)}
                          disabled={isUpdating}
                          className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
                          title="Save Changes"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEdit(row)}
                          className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setItemToDelete(row)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                          asChild
                        >
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Source
                          </a>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalCount > 0 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalCount}</span>{" "}
            entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && !isDeleting && setItemToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Location Data</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {itemToDelete?.place_name}
            </strong>
            ? This action cannot be undone and the data will be permanently
            removed.
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
