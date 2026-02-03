-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- 枚举类型，用于课程状态
create type status as enum (
  'draft',
  'published',
  'archived');

-- 课程标签表
-- position 字段控制全局 tag 列表的显示顺序
CREATE TABLE public.course_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  position integer NOT NULL DEFAULT 0,
  CONSTRAINT course_tags_pkey PRIMARY KEY (id)
);

-- 课程表
-- slug 用于 URL，status 使用上方定义的枚举类型
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_url text,
  status public.status null,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);

-- 课程与标签关系表（多对多）
-- position 表示在当前课程中 tag 的显示顺序
-- 删除或更新课程/标签时默认不级联删除关系，可按需改
CREATE TABLE public.course_tag_relations (
  course_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT course_tag_relations_pkey PRIMARY KEY (course_id, tag_id),
  CONSTRAINT course_tag_relations_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) on update CASCADE on delete CASCADE,
  CONSTRAINT course_tag_relations_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.course_tags(id)on update CASCADE on delete CASCADE
);
