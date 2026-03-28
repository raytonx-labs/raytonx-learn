import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabaseStaticClient } from "@/lib/supabase/static";
import { listCourses } from "@/services/courses/list";

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const tag = (await searchParams).tag ?? "all";

  const coursesQuery = listCourses(supabaseStaticClient, { tag });

  const tagsQuery = supabaseStaticClient.from("course_tags").select("*");

  const [{ data: courses, error: coursesError }, { data: tags, error: tagsError }] =
    await Promise.all([coursesQuery, tagsQuery]);

  if (coursesError || tagsError) {
    return (
      <div>
        Error loading courses:
        {coursesError ? ` Courses error: ${coursesError.message}` : ""}
        {tagsError ? ` Tags error: ${tagsError.message}` : ""}
      </div>
    );
  }

  return (
    <div>
      {/* Hero Title */}
      {/* <section className="text-center">
        <h2 className="text-4xl font-extrabold">{heroTitle["zh-cn"]}</h2>
      </section> */}

      {/* Category Tabs */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="overflow-x-auto">
          <Tabs defaultValue="all" value={tag}>
            <TabsList className="inline-flex gap-2 whitespace-nowrap scroll-smooth">
              <TabsTrigger
                asChild
                key="all"
                value="all"
                className="flex-1 min-w-[120px] px-4 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <Link href={`/`} className="inline-block">
                  All
                </Link>
              </TabsTrigger>
              {tags?.map((tag) => (
                <TabsTrigger
                  asChild
                  key={tag.id}
                  value={tag.slug}
                  className="flex-1 min-w-[120px] px-4 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  <Link href={`/?tag=${tag.slug}`} className="inline-block">
                    {tag.name}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Course Grid */}
      <section
        className="max-w-6xl mx-auto px-4 py-6 grid gap-6 
                        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {courses && courses.length > 0 ? (
          courses.map((c) => (
            <Link href={`/${c.slug}`} className="block h-full" key={c.id}>
              <Card className="flex flex-col h-full hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 overflow-hidden">
                {/* 封面图 */}
                <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
                  {c.cover_url ? (
                    <Image
                      src={c.cover_url}
                      alt={c.name}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* 卡片内容 */}
                <CardHeader className="p-4 pb-2 flex flex-col flex-1">
                  <CardTitle className="text-base font-semibold line-clamp-2">{c.name}</CardTitle>

                  {/* 技术栈标签 */}
                  {c.course_tag_relations?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {c.course_tag_relations.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag.course_tags.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground line-clamp-4 px-4 pb-4 flex-1">
                  {c.description}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-20">
            No courses available.
          </div>
        )}
      </section>
    </div>
  );
}
