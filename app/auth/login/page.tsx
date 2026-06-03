import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "./action";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-sm border-border/50">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-fit mb-2">
            <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Command Center</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the pipeline.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Form executes the 'login' server action directly */}
          <form action={login} className="space-y-4 flex flex-col w-full">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message Display */}
            {searchParams?.message && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md text-center">
                {searchParams.message}
              </div>
            )}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}