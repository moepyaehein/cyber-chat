
import { FileText, Shield } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-bold tracking-tight text-primary">Terms of Service</h1>
            <p className="mt-2 text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-card-foreground/90">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CyGuard application (the "Service") operated by us.
            </p>

            <h2 className="text-2xl font-semibold text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2 className="text-2xl font-semibold text-primary">2. Description of Service</h2>
            <p>
              CyGuard is an AI-powered assistant designed to help users identify and understand online security and privacy threats. The Service uses artificial intelligence to analyze user-submitted content. The analysis provided is for informational purposes only and does not constitute professional cybersecurity advice.
            </p>

            <h2 className="text-2xl font-semibold text-primary">3. User Conduct</h2>
            <p>
              You agree not to use the Service:
            </p>
            <ul>
              <li>For any unlawful purpose or to promote illegal activities.</li>
              <li>To attempt to probe, scan, or test the vulnerability of the Service or any related system or network.</li>
              <li>To interfere with or disrupt the access of any user, host, or network, including, without limitation, sending a virus, overloading, flooding, spamming, or mail-bombing the Service.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary">4. Disclaimers and Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The analysis and recommendations provided by the AI are generated automatically and may contain errors or inaccuracies. We do not guarantee the correctness or completeness of the information provided. You agree that you use the Service at your own risk and that we are not liable for any damages based on your use of the Service.
            </p>
            
            <h2 className="text-2xl font-semibold text-primary">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of CyGuard and its licensors.
            </p>

            <h2 className="text-2xl font-semibold text-primary">6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-primary">7. Governing Law</h2>
            <p>
             These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold text-primary">8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
