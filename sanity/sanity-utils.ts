import { createClient, groq } from "next-sanity";
import clientConfig from "./config/client-config";
import { ImageDataType } from "./types/ImageDataType";

export async function getAll(): Promise<ImageDataType[]> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "gallery"] {
      _id,
      title,
      ratio,
      category,
      "imageUrl": video.asset->url,
      "alt": video.alt
    }`
  );
}

export async function getByCategory(
  category: string
): Promise<ImageDataType[]> {
  return createClient(clientConfig).fetch(
    groq` *[_type == "gallery" && category == "${category}"] {
      _id,
      title,
      ratio,
      category,
      "imageUrl": video.asset->url,
      "alt": video.alt
    }`
  );
}
