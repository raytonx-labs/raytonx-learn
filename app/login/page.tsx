import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { login, signup } from "./actions";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="signup">注册</TabsTrigger>
        </TabsList>

        {/* 登录面板 */}
        <TabsContent value="login">
          <form>
            <Card>
              <CardHeader>
                <CardTitle>欢迎回来</CardTitle>
                <CardDescription>输入你的邮箱和密码访问课程</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button formAction={login} className="w-full">
                  进入平台
                </Button>
                {searchParams?.message && (
                  <p className="text-sm text-destructive text-center">{searchParams.message}</p>
                )}
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* 注册面板 */}
        <TabsContent value="signup">
          <form>
            <Card>
              <CardHeader>
                <CardTitle>创建账号</CardTitle>
                <CardDescription>开始你的 Raytonx 学习之旅</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-email">邮箱</Label>
                  <Input
                    id="s-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-password">密码</Label>
                  <Input id="s-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button formAction={signup} variant="outline" className="w-full">
                  立即注册
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
