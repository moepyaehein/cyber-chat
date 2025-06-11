
"use client";

import type { FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { SignupFormData } from '@/app/(auth)/schemas';
import { signupSchema } from '@/app/(auth)/schemas';
import { UserPlus } from 'lucide-react';

const SignUpPage: FC = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    const result = await signUp(data);
    if (!result.success && result.error) {
      toast({
        title: 'Sign Up Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
    // On success, AuthContext handles redirect
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <UserPlus className="h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl">Create your CyGuard Account</CardTitle>
        <CardDescription>Join CyGuard to enhance your cybersecurity.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="•••••••• (min. 6 characters)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/signin">Sign In</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;
