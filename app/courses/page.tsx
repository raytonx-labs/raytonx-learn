import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  return (
    <div>
      {/* Category Tabs */}
      <section className="max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="nextjs">NextJS</TabsTrigger>
            <TabsTrigger value="react">NestJS</TabsTrigger>
            <TabsTrigger value="suapbase">Supabase</TabsTrigger>
            <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Course Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {c.chapters} Chapters
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

const COURSES = [
  { title: "Build and Deploy a Cursor Clone", chapters: 13 },
  { title: "Build and Deploy an AI Automation SaaS", chapters: 31 },
  { title: "Build and Deploy a B2B SaaS AI Support Platform", chapters: 35 },
  { title: "Build and Deploy a Lovable Clone", chapters: 21 },
  { title: "Build and Deploy a SaaS AI Agent Platform", chapters: 30 },
  { title: "Build a Multi-Tenant E-Commerce with Next.js & Stripe", chapters: 34 },
  { title: "Build a YouTube Clone", chapters: 39 },
  { title: "Build a Google Docs Clone", chapters: 33 },
  { title: "Build a Jira Clone", chapters: 41 },
  { title: "Build a Slack Clone", chapters: 42 },
  { title: "Build a Canva Clone", chapters: 52 },
  { title: "Build a Finance Platform", chapters: 31 },
];
