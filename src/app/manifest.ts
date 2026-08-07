import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ibrahim — Fine Jewelry",
    short_name: "Ibrahim",
    description: "Luxury jewelry, crafted to last.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbf9",
    theme_color: "#fcfbf9",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
