"use client"; // Mark as Client Component for state and interaction

import { createPrompt, deletePrompt, updatePrompt } from "@/actions/prompts-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Import Shadcn Card
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Check, Copy, Edit2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
// Define the expected structure for a prompt object
interface Prompt {
  id: number;
  name: string;
  description: string;
  content: string;
}

// Define the props the component expects
interface PromptsGridProps {
  initialPrompts: Prompt[]; // Prop definition
}

export const PromptsGrid = ({ initialPrompts }: PromptsGridProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- State for Create/Edit Form ---
  const [isFormOpen, setIsFormOpen] = useState(false); // Dialog visibility
  const [formData, setFormData] = useState({ name: "", description: "", content: "" }); // Form field values
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state during submission
  const [error, setError] = useState<string | null>(null); // Error message state

  // --- Add State for Editing ---
  const [editingId, setEditingId] = useState<number | null>(null); // null when creating, number (ID) when editing

  // --- Add State for Deletion ---
  const [deletingId, setDeletingId] = useState<number | null>(null); // ID of prompt to delete
  const [isDeleting, setIsDeleting] = useState(false); // Deletion loading state
  const [deleteError, setDeleteError] = useState<string | null>(null); // Deletion error state

  // --- Add Handlers for Deletion ---
  const handleOpenDeleteDialog = (id: number) => {
    setDeletingId(id); // Set the ID to trigger the dialog opening
    setDeleteError(null); // Clear any previous delete errors
  };

  const handleCloseDeleteDialog = () => {
    // Prevent closing if deletion is in progress
    if (!isDeleting) {
      setDeletingId(null);
      setDeleteError(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return; // Exit if no ID is set

    setIsDeleting(true); // Set loading state
    setDeleteError(null);

    try {
      // Call the deletePrompt Server Action
      await deletePrompt(deletingId);

      // Update local state by removing the deleted prompt
      setPrompts((prevPrompts) => prevPrompts.filter((p) => p.id !== deletingId));

      // Reset state and close dialog (implicitly closed by setting deletingId to null)
      setDeletingId(null);
      setIsDeleting(false);
    } catch (err) {
      console.error("Delete Prompt Error:", err);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete prompt.");
      setIsDeleting(false); // Reset loading state on error
      // Keep dialog open to show error by not setting deletingId to null here
    }
  };
  // --- End Deletion Handlers ---

  // --- Add Handler for Edit Button Click ---
  const handleEditClick = (promptToEdit: Prompt) => {
    setEditingId(promptToEdit.id); // Store the ID of the prompt being edited
    // Set form data to the current values of the prompt
    setFormData({
      name: promptToEdit.name,
      description: promptToEdit.description,
      content: promptToEdit.content
    });
    setError(null); // Clear errors
    setIsFormOpen(true); // Open the dialog
  };

  // --- Event Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Update the formData state when input values change
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // --- Update resetAndCloseForm ---
  const resetAndCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ name: "", description: "", content: "" });
    setError(null);
    setIsSubmitting(false);
    setEditingId(null); // Reset editingId when closing/resetting
  };

  // --- Modify handleSubmit for Update Logic ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId !== null) {
        // --- UPDATE PATH ---
        // Call updatePrompt server action
        const updatedPrompt = await updatePrompt({ id: editingId, ...formData });
        // Update the prompts state by replacing the old version with the updated one
        setPrompts((prevPrompts) => prevPrompts.map((p) => (p.id === editingId ? updatedPrompt : p)));
        console.log(`Prompt ${editingId} updated.`);
      } else {
        // --- CREATE PATH (No changes needed here) ---
        const newPrompt = await createPrompt(formData);
        setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);
        console.log(`Prompt created with ID ${newPrompt.id}.`);
      }
      resetAndCloseForm(); // Close and reset form on success for both paths
    } catch (err) {
      console.error("Save Prompt Error:", err);
      setError(err instanceof Error ? err.message : "Failed to save prompt.");
      setIsSubmitting(false); // Reset submitting state on error
    }
  };

  // --- Handle Copy Functionality ---
  const handleCopy = async (id: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      // Reset copied status after 1.5 seconds
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Display message and create button if no prompts exist
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <Button
          onClick={() => {
            /* Add create logic */
          }}
          className="mb-6 gap-2"
        >
          <Plus className="w-5 h-5" /> Create First Prompt
        </Button>
        <p className="text-gray-600 dark:text-gray-300">No prompts found. Get started by creating one!</p>
      </div>
    );
  }

  return (
    <>
      {/* Update Create Button onClick to reset editingId */}
      <div className="mb-6 flex justify-end">
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            if (!open) resetAndCloseForm();
            else setIsFormOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                /* Ensure create mode */ resetAndCloseForm();
                setIsFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="w-5 h-5" /> Create Prompt
            </Button>
          </DialogTrigger>
          <DialogContent
            /* ... */ onInteractOutside={(e) => {
              if (isSubmitting) e.preventDefault();
            }}
          >
            <DialogHeader>
              {/* Dynamic Title */}
              <DialogTitle>{editingId ? "Edit Prompt" : "Create New Prompt"}</DialogTitle>
              <DialogDescription>{editingId ? "Make changes to your existing prompt." : "Enter the details for your new prompt."}</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 py-4"
            >
              {/* Form fields remain the same - value={formData...} handles pre-filling */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="name"
                  className="text-right"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              {/* ... other fields ... */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="description"
                  className="text-right"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="content"
                  className="text-right pt-2"
                >
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  className="col-span-3 min-h-[120px]"
                  disabled={isSubmitting}
                />
              </div>
              {error && <p className="col-span-4 text-center text-sm text-red-500 px-6">{error}</p>}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndCloseForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {/* Dynamic Submit Button Text */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (editingId ? "Saving..." : "Creating...") : editingId ? "Save Changes" : "Create Prompt"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Add Delete Confirmation Dialog --- */}
      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) handleCloseDeleteDialog();
        }}
      >
        {/* The 'open' prop controls visibility based on deletingId state */}
        {/* onOpenChange calls our close handler when dismissal is attempted */}
        <DialogContent
          onInteractOutside={(e) => {
            if (isDeleting) e.preventDefault(); /* Prevent closing while deleting */
          }}
        >
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the prompt:
              <br />
              <strong className="break-words">
                {/* Find the name of the prompt being deleted for display */}
                {prompts.find((p) => p.id === deletingId)?.name ?? "this prompt"}
              </strong>
            </DialogDescription>
          </DialogHeader>
          {/* Show delete error message if present */}
          {deleteError && <p className="text-sm text-red-600 dark:text-red-400 text-center py-2">{deleteError}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- End Delete Confirmation Dialog --- */}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map over the prompts state array */}
        {prompts.map((prompt, index) => (
          <motion.div /* Animation wrapper */
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {/* Shadcn Card */}
            <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700/50">
              <CardContent className="pt-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-2">
                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Allow text to wrap/truncate */}
                    <h2
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate"
                      title={prompt.name}
                    >
                      {prompt.name}
                    </h2>
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
                      title={prompt.description}
                    >
                      {prompt.description}
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Edit"
                      onClick={() => handleEditClick(prompt)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500" // Destructive styling hint
                      title="Delete"
                      onClick={() => handleOpenDeleteDialog(prompt.id)} // Call handler to open confirmation
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title={copiedId === prompt.id ? "Copied!" : "Copy"}
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                    >
                      {copiedId === prompt.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {/* Prompt Content */}
                <div className="flex-grow mt-2 bg-gray-100 dark:bg-gray-700/60 rounded p-3 overflow-auto max-h-40">
                  {" "}
                  {/* Limit height and allow scroll */}
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words font-mono">{prompt.content}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};
