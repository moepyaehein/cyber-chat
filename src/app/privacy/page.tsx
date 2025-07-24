
import { Shield, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center justify-start">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold">CyGuard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl py-12 md:py-20 px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Privacy Policy</h1>
            <p className="mt-2 text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-card-foreground/90">
            <p>
              Welcome to CyGuard ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our AI-powered cybersecurity assistant (the "Service").
            </p>

            <h2 className="text-2xl font-semibold text-primary">1. Information We Do Not Collect</h2>
            <p>
              Our service is built with a "privacy-first" approach. We do not store, log, or retain any of the content you submit for analysis, including:
            </p>
            <ul>
              <li>Text, links, or messages you paste into the chat.</li>
              <li>Screenshots you upload for analysis.</li>
              <li>The results of any AI analysis.</li>
              <li>Your chat history with the AI assistant. Your chat history is stored exclusively in your browser's local storage and is not transmitted to our servers.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary">2. Information We Collect</h2>
            <p>
              To provide and maintain the Service, we collect the following limited information:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you sign up, we collect your email address to create and manage your account. Your password is encrypted and is never visible to us.
              </li>
              <li>
                <strong>Usage Data (Non-Personal):</strong> We may collect anonymized, aggregated data about feature usage to understand how our Service is being used and to improve it. This data is not tied to your personal account and does not include any of the content you analyze.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary">3. How We Use Your Information</h2>
            <p>
              The limited information we collect is used solely for the following purposes:
            </p>
            <ul>
              <li>To provide, operate, and maintain our Service.</li>
              <li>To manage your account and authentication.</li>
              <li>To improve our Service by analyzing aggregated usage trends.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-primary">4. Data Security</h2>
            <p>
             We implement a variety of security measures to maintain the safety of your personal information. All communication with our service is encrypted using Transport Layer Security (TLS).
            </p>

            <h2 className="text-2xl font-semibold text-primary">5. Third-Party Services</h2>
            <p>
              We use Google's Firebase for authentication and Google's Genkit for AI model processing. These services process data as described in their respective privacy policies. The content you submit for analysis is sent to the AI model for real-time processing but is not stored or used for model training by our providers as per their enterprise data privacy promises.
            </p>
            
            <h2 className="text-2xl font-semibold text-primary">6. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-semibold text-primary">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary"/>
              <a href="mailto:privacy@cyguard.example.com" className="text-primary hover:underline">privacy@cyguard.example.com</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
