"use client";

//react
import { useState } from "react";
// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// hooks
import { useToast } from "@/app/components/Toast/useToast";
import { useProgram } from "@/app/hooks/useProgram";
// components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/AlertDialog";

import { Button } from "@/app/components/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/Form";
import { Textarea } from "@/app/components/Textarea";
import { Loader2, RefreshCcw } from "lucide-react";

const formSchema = z.object({
  confession: z
    .string()
    .min(1, "Confession must be 'something', if you know what I mean.")
    .max(
      40,
      "Oops, looks like you have a lot to confess. Try to keep it under 40 characters to save memory."
    ),
});

const AddConfession = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confession: "",
    },
  });

  const {
    addConfession,
    isTransactionPending,
    isInitialized,
    getAllConfessions,
    findProfileAccounts,
  } = useProgram();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await addConfession(values.confession);

    if (response && !("error" in response)) {
      form.reset();
      setIsModalOpen(false);
    }
  };

  const handleRefresh = async (e: any) => {
    e.preventDefault();

    await getAllConfessions();
    await findProfileAccounts();

    toast({
      title: "Refreshed confessions.",
    });
  };

  return (
    <>
      <div className="w-full flex gap-2 justify-end">
        <Button variant={"ghost"} onClick={handleRefresh}>
          <RefreshCcw className="w-5 h-5 hover:animate-spin" />
        </Button>
        <Button
          isLoading={isTransactionPending}
          onClick={() => setIsModalOpen(true)}
          disabled={isTransactionPending || !isInitialized}
        >
          Confess
        </Button>
      </div>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What would you like to confess?</AlertDialogTitle>
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="confession"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="I did something..."
                          minLength={1}
                          maxLength={200}
                          className="resize-none"
                          disabled={isTransactionPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Don&apos;t worry, your secret is safe with us 🤫
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isTransactionPending}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isTransactionPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isTransactionPending && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddConfession;
