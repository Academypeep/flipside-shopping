import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flipside",
    short_name: "Flipside",
    description: "A trusted marketplace for making offers on things you want.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    icons: [{ src: "/flipside-marketplace.png", sizes: "any", type: "image/png" }],
  }
}
