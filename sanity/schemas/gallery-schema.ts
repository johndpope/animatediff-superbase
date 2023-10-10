const CATEGORY = [
  { title: "Toon", value: "toon" },
  { title: "Realistic", value: "realistic" },
  { title: "3D", value: "3d" },
];

const RATIOS = [
  { title: "Large", value: "large" },
  { title: "Medium", value: "medium" },
  { title: "Small", value: "small" },
];

export default {
  title: "Gallery",
  name: "gallery",
  type: "document",
  fields: [
    {
      title: "Image Title",
      name: "title",
      type: "string",
      validation: (Rule: any) => [
        Rule.required().error("Image Title is required"),
        Rule.min(3).error("Title must be between 3 and 50 characters"),
        Rule.max(50).warning("Shorter titles are usually better"),
      ],
    },
    {
      title: "Image Ratio",
      name: "ratio",
      type: "string",
      initialValue: "landscape",
      options: {
        list: RATIOS,
        layout: "radio",
      },
      validation: (Rule: any) =>
        Rule.required().error("Image Ratio is required"),
    },
    {
      title: "Image Category",
      name: "category",
      type: "string",
      initialValue: "architecture",
      options: {
        list: CATEGORY,
      },
      validation: (Rule: any) =>
        Rule.required().error("Image Category is required"),
    },
    {
      title: "Video",
      name: "video",
      type: "file",
      validation: (Rule: any) => Rule.required().error("Video is required"),
      options: {
        accept: ".mp4",
      },
      fields: [
        {
          title: "Alt Text",
          name: "alt",
          type: "string",
          validation: (Rule: any) => [
            Rule.required().error("Alt text is required"),
            Rule.min(3).error("Alt text must be between 3 and 50 characters"),
            Rule.max(50).warning("Shorter alt text are usually better"),
          ],
        },
      ],
    },
  ],
};
