import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { credits } from "@/data/credits";

/**
 * The card shown when the site is shared: his portrait bled into the night,
 * the name set as it is in the hero. Rendered once at build time.
 *
 * The photograph is CC BY 2.0, and a link preview travels without the page's
 * credits, so the card carries its own attribution.
 */
export const alt = "Sushant Singh Rajput, 21 January 1986 – 14 June 2020. SSR Universe.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Each path is spelled out in full: a computed path makes the bundler
  // trace the whole project into the server output.
  const [light, script, sans, portrait] = await Promise.all([
    readFile(join(process.cwd(), "assets", "fonts", "Cormorant-Light.ttf")),
    readFile(join(process.cwd(), "assets", "fonts", "Caveat-Medium.ttf")),
    readFile(join(process.cwd(), "assets", "fonts", "Inter-Medium.ttf")),
    readFile(join(process.cwd(), "public", "images", "hero-portrait.jpg")),
  ]);
  const photo = credits["hero-portrait"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#04060c",
          backgroundImage: "radial-gradient(ellipse 90% 80% at 75% 40%, #101a30 0%, #04060c 70%)",
          color: "#f6f2e9",
          fontFamily: "Inter",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
        <img
          src={`data:image/jpeg;base64,${portrait.toString("base64")}`}
          alt=""
          width={560}
          height={630}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 560,
            height: 630,
            objectFit: "cover",
            objectPosition: "50% 18%",
          }}
        />
        {/* Cool and darken the frame toward the sky; the hero does this with a
            colour blend, which the card renderer has no equivalent for. */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 560,
            height: 630,
            display: "flex",
            background: "rgba(10,20,40,.5)",
          }}
        />
        {/* Sink the photo into the sky, as the hero does. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, #04060c 0%, #04060c 53.5%, rgba(4,6,12,.7) 62%, rgba(4,6,12,.25) 72%, rgba(4,6,12,0) 82%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(0deg, rgba(4,6,12,.9) 0%, transparent 30%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 760,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 18, letterSpacing: 5, color: "#c9a664" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 14 }}>
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="#c9a664" />
            </svg>
            SSR UNIVERSE
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontFamily: "Cormorant",
              fontSize: 80,
              lineHeight: 1,
              letterSpacing: 7,
            }}
          >
            <span>SUSHANT</span>
            <span>SINGH</span>
            <span>RAJPUT</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 18,
              letterSpacing: 6,
              color: "rgba(246,242,233,.72)",
            }}
          >
            21 JAN 1986  —  14 JUN 2020
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "Caveat", fontSize: 56, color: "#c9a664" }}>
            Keep looking up.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 26,
            display: "flex",
            fontSize: 13,
            color: "rgba(246,242,233,.5)",
          }}
        >
          Photo: {photo.author} · {photo.license}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: light, weight: 300, style: "normal" },
        { name: "Caveat", data: script, weight: 500, style: "normal" },
        { name: "Inter", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
