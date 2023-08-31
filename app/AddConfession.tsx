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
  AlertDialogDescription,
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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  confession: z
    .string()
    .min(1, "Confession must be 'something', if you know what I mean.")
    .max(
      200,
      "Oops, looks like you have a lot to confess. Try to keep it under 200 characters."
    ),
});

const AddConfession = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confession: "",
    },
  });

  const { addConfession, isTransactionPending, successMessage } = useProgram();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await addConfession(values.confession);
    console.log("response", response);

    if (response && !("error" in response)) {
      toast({
        variant: "default",
        title: "You just confessed! 😮",
        description: successMessage,
      });
      form.reset();
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button
        isLoading={isTransactionPending}
        onClick={() => setIsModalOpen(true)}
        className="self-end"
      >
        Confess.
      </Button>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What would you like to confess?</AlertDialogTitle>
            <AlertDialogDescription>
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
            </AlertDialogDescription>
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
