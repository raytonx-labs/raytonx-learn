import { createClient } from "@supabase/supabase-js";
import { ImageResponse } from "next/og";

import { publishedCoursesQuery } from "@/services/courses/queries";

export const alt = "RaytonX Learn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;

  // Create Supabase client directly to avoid edge runtime issues
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: course } = await publishedCoursesQuery(supabase)
    .eq("slug", courseSlug)
    .maybeSingle();

  const title = course?.name || "RaytonX Learn";
  const displayTitle = title.length > 50 ? title.slice(0, 47) + "..." : title;
  const description = course?.description
    ? course.description.length > 120
      ? course.description.slice(0, 117) + "..."
      : course.description
    : "Learn modern software development";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        padding: "60px 80px",
        position: "relative",
      }}
    >
      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#111111",
          display: "flex",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            fontWeight: 600,
            color: "#111111",
            letterSpacing: "-0.02em",
          }}
        >
          RaytonX Learn
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
          }}
        >
          {displayTitle}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#6b7280",
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          {description}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            color: "#111111",
            fontWeight: 500,
          }}
        >
          <span>Start Learning</span>
          <span style={{ display: "flex" }}>→</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: "#9ca3af",
          }}
        >
          learn.raytonx.com
        </div>
      </div>
    </div>,
    { ...size },
  );
}
