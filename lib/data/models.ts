export const types = ["ControlNet"] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
}

export const models: Model<ModelType>[] = [
  {
    id: "toonyou_beta3.safetensors",
    name: "toonyou",
    description: "Fast and capable model across all themes.",
  },
  {
    id: "lyriel_v16.safetensors",
    name: "lyriel",
    description: "Fast and capable model across all themes.",
  },
  {
    id: "rcnzCartoon3d_v10.safetensors",
    name: "rcnzCartoon3d",
    description: "Fast and capable model across all themes.",
  },
  {
    id: "majicmixRealistic_v5Preview.safetensors",
    name: "majicmixRealistic",
    description: "Fast and capable model across all themes.",
  },
  {
    id: "realisticVisionV40_v20Novae.safetensors",
    name: "realisticVision",
    description: "Fast and capable model across all themes.",
  },
];
