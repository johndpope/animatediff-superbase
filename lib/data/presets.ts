export interface Preset {
  model: string;
  category: string;
  name: string;
  prompt: string;
  negativePrompt?: string;
  inferenceStep: number;
  guidance?: number;
  strength?: number;
  seed?: number;
  image?: {
    name: string;
    url: string;
  };
  exampleOutput?: string;
}

const negativePrompt = "ugly, disfigured, low quality, blurry, nsfw";
const seed = -1;
const guidance = 9.5;

export const presets: Preset[] = [
  {
    category: "Toon",
    model: "toonyou_beta3.safetensors",
    name: "Cherry blossom anime",
    prompt:
      "masterpiece, best quality, 1girl, solo, cherry blossoms, hanami, pink flower, white flower, spring season, wisteria, petals, flower, plum blossoms, outdoors, falling petals, white hair, black eyes",
    negativePrompt:
      "badhandv4, easynegative, ng_deepnegative_v1_75t, verybadimagenegative_v1.3, bad-artist, bad_prompt_version2-neg, teeth",
    inferenceStep: 25,
    guidance: 7.5,
    seed: 255224557,
    exampleOutput:
      "https://replicate.delivery/pbxt/Z8X0tSefukjHvENMNfszJCtJtM0i4VOvO1QEJB5SSO2sekPFB/out.mp4",
  },
  {
    category: "3d",
    model: "rcnzCartoon3d_v10.safetensors",
    name: "Jane Eyre realistic",
    prompt:
      "Jane Eyre with headphones, natural skin texture,4mm,k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, cinematic look, soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded",
    negativePrompt:
      "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, mutated hands and fingers, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation",
    inferenceStep: 25,
    guidance: 7.5,
    seed: 255224557,
    exampleOutput:
      "https://replicate.delivery/pbxt/TficN2joTY1cSSe6xVDK0ff3EZi8OHPQhXwIZGjikCfWDIPKC/out.mp4",
  },
  {
    category: "Realistic",
    model: "majicmixRealistic_v5Preview.safetensors",
    name: "Photorealistic girl",
    prompt:
      "best quality, masterpiece, photorealistic, 1girl, light smile, shirt with collars, waist up, dramatic lighting, from below",
    negativePrompt:
      "nsfw, ng_deepnegative_v1_75t, badhandv4, worst quality, low quality, normal quality, lowres, watermark, monochrome",
    inferenceStep: 25,
    guidance: 7.5,
    seed: 255224557,
    exampleOutput:
      "https://replicate.delivery/pbxt/Zh775Sq5nM5sOhfhiDGHvyql1gPaX9SuyPN9X6TZo1ivg8oIA/out.mp4",
  },
  {
    category: "Realistic",
    model: "realisticVisionV40_v20Novae.safetensors",
    name: "Coastline realistic",
    prompt:
      "photo of coastline, rocks, storm weather, wind, waves, lightning, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3",
    negativePrompt:
      "blur, haze, deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
    inferenceStep: 25,
    guidance: 7.5,
    seed: 255224556,
    exampleOutput:
      "https://replicate.delivery/pbxt/vAIp7yPnV4KnEVwqEWbxiBWHqUYxIEy6PmkSLUUwUBu1WrVE/out.mp4",
  },
  {
    category: "Lyriel",
    model: "lyriel_v16.safetensors",
    name: "Forbidden castle, game art",
    prompt:
      "A forbidden castle high up in the mountains, pixel art, intricate details2, hdr, intricate details, hyperdetailed5, natural skin texture, hyperrealism, soft light, sharp, game art, key visual, surreal",
    negativePrompt:
      "3d, cartoon, anime, sketches, worst quality, low quality, normal quality, lowres, normal quality, monochrome, grayscale, watermark",
    inferenceStep: 25,
    seed: 255224557,
    guidance: 7.5,
    exampleOutput:
      "https://replicate.delivery/pbxt/gBBUT3rKDC7LB9VLc5eVWXv2yXbhm6w4bX5e9WNghqoQH5RRA/out.mp4",
  },
];
