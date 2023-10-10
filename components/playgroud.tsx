"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Cross2Icon,
  DotsHorizontalIcon,
  ExternalLinkIcon,
  GearIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PaperPlaneIcon,
  PlusCircledIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { SuccessIcon } from "./success-icon";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ToastAction } from "@/components/ui/toast";

import { ModelSelector } from "@/components/preset-selectors/model-selector";
import { InferenceStepSelector } from "@/components/preset-selectors/inference-step-selector";
import { SeedField } from "@/components/preset-selectors/seed-field";
import { GuidanceSelector } from "@/components/preset-selectors/guidance-selector";
import { NegativePromptField } from "@/components/preset-selectors/negative-prompt-field";

import { playgroundFormSchema } from "@/schemas/formSchemas";
import { Model, models, types } from "@/lib/data/models";
import { Preset } from "@/lib/data/presets";
import { extractProgress } from "@/utils/helpers";
import { usePlaygroundForm } from "@/lib/hooks/use-playground-form";
import { Row } from "./ui/row";
import { Column } from "./ui/column";
import ExampleTemplatesSection from "./example-templates-section";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

export default function Playground({ user, userDetails, subscription }) {
  const router = useRouter();
  const form = usePlaygroundForm();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(models[0]);

  // State management for Replicate prediction
  const [prediction, setPrediction] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting...");

  // Form states
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof playgroundFormSchema>) {
    console.log("values", values);
    setStatus("Starting...");
    setProgress(0);
    setPrediction(null);
    setSubmitting(true);

    // Make initial request to Lambda function to create a prediction
    const res = await fetch(
      "https://xzaox3q69a.execute-api.us-east-1.amazonaws.com/prod/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user.id,
          subscription_tier: subscription?.price_id,
        }),
      }
    );

    const response = await res.json();
    console.log("response", response);

    if (res.status !== 200 || response.status === "error") {
      if (response.message === "You have insufficient credits.") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "You have no credits left. You can continue to use Entropy for free at a limited capacity, but you won't be able to upload your own image.",
          action: (
            <ToastAction
              altText="Add credits"
              onClick={() => {
                router.push("/pricing");
              }}
            >
              <PlusCircledIcon className="mr-2" /> Add credits
            </ToastAction>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.message || "Unknown error",
        });
      }
      setSubmitting(false);
      return;
    }

    // Extract the prediction ID from the returned URL for polling
    const predictionId = response.url.split("/").pop();

    // Poll the API Gateway endpoint for the status using the prediction ID
    let predictions = null;
    while (!predictions && predictionId) {
      let pollRes = await fetch(
        `https://xzaox3q69a.execute-api.us-east-1.amazonaws.com/prod/predictions/${predictionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.REPLICATE_API_KEY,
          },
        }
      );
      let pollResponse = await pollRes.json();
      console.log("pollResponse", pollResponse);
      const { status, logs } = pollResponse;

      if (status === "processing") {
        setStatus("Generating...");
      } else {
        setStatus(status.charAt(0).toUpperCase() + status.slice(1) + "...");
      }
      const progress = extractProgress(logs);
      if (progress !== null) {
        setProgress(progress);
      }

      if (pollResponse.status === "succeeded") {
        predictions = pollResponse;
        setPrediction(predictions);
        setIsSuccess(true);
        setSubmitting(false);
        toast({
          title: "QR Code generated!",
        });
      } else if (pollResponse.status === "failed") {
        setSubmitting(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: pollResponse.message || "Image generation failed.",
        });
        break;
      } else {
        // Delay to make requests to API Gateway every 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    // After 2 seconds of image generation success, restore button to default state
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  }

  return (
    <>
      <Column className="gap-8 w-full px-8 md:px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto justify-center flex flex-col">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center gap-4">
                        <div className="max-w-2xl border rounded-lg shadow-lg py-4 px-5 mb-8 flex-grow">
                          <div className="flex items-center gap-4">
                            <textarea
                              placeholder={
                                "a cubism painting of a town with a lot of houses in the snow with a sky background, Andreas Rocha, matte painting concept art, a detailed matte painting"
                              }
                              className="textarea flex-1 border-0 shadow-none bg-transparent resize-none outline-none text-sm"
                              {...field}
                            />
                            <div className="flex justify-end items-center">
                              <Button
                                variant="ghost"
                                className="opacity-50 hover:opacity-100 transition duration-200"
                              >
                                <PaperPlaneIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-0 hover:bg-transparent hover:opacity-100 transition duration-200 opacity-50"
                            >
                              <GearIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="space-y-2 py-6 min-w-[350px]">
                            <ModelSelector
                              types={types}
                              models={models}
                              onModelChange={setSelectedModel}
                              form={form}
                            />
                            <NegativePromptField form={form} />
                            <InferenceStepSelector form={form} />
                            <GuidanceSelector form={form} />
                            <SeedField form={form} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {prediction && prediction.output ? (
              <Dialog>
                <DialogTrigger>
                  <div className="bg-muted rounded-md hover:opacity-90 duration-500 ease-in-out mx-auto">
                    <Image
                      alt="Entropy image output"
                      src={prediction.output[prediction.output.length - 1]}
                      width={768}
                      height={768}
                      quality={100}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <figure className={"aspect-square"}>
                    <Image
                      fill={true}
                      loading={"eager"}
                      alt="Glyph image output"
                      src={prediction.output[prediction.output.length - 1]}
                      quality={100}
                    />
                  </figure>
                  <Link
                    href={prediction.output[prediction.output.length - 1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span className="sr-only">External Link</span>
                  </Link>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="min-h-[300px] min-w-[320px] md:min-h-[420px] md:max-w-[420px] rounded-md border bg-muted relative mx-auto">
                {isSubmitting && (
                  <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full gap-3">
                    <Label className="text-muted-foreground font-normal">
                      {status}
                    </Label>
                    <Progress className="w-1/2" value={progress} />
                    <div className="absolute bottom-4 w-full text-center text-slate-500 text-xs">
                      Takes 8-20 seconds to generate.
                    </div>
                  </div>
                )}
                {!isSubmitting && selectedImage && (
                  <Image
                    alt="Selected image"
                    src={selectedImage.url}
                    width={768}
                    height={768}
                    quality={100}
                  />
                )}
              </div>
            )}
          </form>
        </Form>
      </Column>

      <Row className="my-16 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <Column className="w-full items-center justify-start px-8 md:px-5 lg:px-0">
        <Column className="w-full space-y-1">
          <p className="text-xl font-semibold">Need inspiration?</p>
          <p className="text-md text-muted-foreground pb-5">
            Try out one of the prompts below.
          </p>
        </Column>
        <ExampleTemplatesSection
          form={form}
          setSelectedImage={setSelectedImage}
        />
      </Column>
    </>
  );
}
