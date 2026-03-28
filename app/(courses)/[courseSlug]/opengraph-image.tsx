import { ImageResponse } from "next/og";
import { CSSProperties } from "react";

import { supabaseStaticClient } from "@/lib/supabase/static";
import { getCourseBySlug } from "@/services/courses/detail";

export const alt = "RaytonX Learn - 课程封面";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = await getCourseBySlug(supabaseStaticClient, courseSlug);

  // 统一的背景样式
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #0f172a 0%, #1e2937 100%)",
    color: "white",
    padding: "60px 80px",
    position: "relative",
  };

  if (!course) {
    return new ImageResponse(
      <div style={{ ...containerStyle, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", fontSize: 80, fontWeight: 700 }}>RaytonX Learn</div>
      </div>,
      { ...size },
    );
  }

  const title = course.name.length > 60 ? course.name.slice(0, 57) + "..." : course.name;
  const description = course.description
    ? course.description.length > 150
      ? course.description.slice(0, 147) + "..."
      : course.description
    : "";

  return new ImageResponse(
    <div style={containerStyle}>
      {/* 背景装饰 - 确保 display: flex 即使它是空的 */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          display: "flex",
        }}
      />

      {/* Logo 部分 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
        <div style={{ display: "flex", fontSize: "28px", fontWeight: 600, marginLeft: "16px" }}>
          RaytonX Learn
        </div>
      </div>

      {/* 内容主体 - 必须显式声明 display: flex */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 800,
            marginBottom: "24px",
            lineHeight: 1.1,
            color: "white",
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: "#cbd5e1",
              lineHeight: 1.5,
              maxWidth: "800px",
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "40px",
        }}
      >
        <div style={{ display: "flex", fontSize: "24px", color: "#3b82f6", fontWeight: 600 }}>
          立即学习 →
        </div>
        <div style={{ display: "flex", fontSize: "22px", color: "#64748b" }}>
          https://raytonx.com/courses/{courseSlug}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
