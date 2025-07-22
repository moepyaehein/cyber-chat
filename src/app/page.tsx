
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BotMessageSquare, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center justify-start">
            <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold">CyGuard</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/signin">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-cyan-300">
              Your AI-Powered Cybersecurity Assistant
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Analyze suspicious messages, links, and even screenshots with CyGuard. Stay one step ahead of online threats with your smart, privacy-first security partner.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-secondary/20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <BotMessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Threat Analysis</h3>
                <p className="text-muted-foreground">
                  Paste text, links, or upload screenshots. Get immediate, AI-driven analysis of potential phishing, scams, and malware threats.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Powerful Security Tools</h3>
                <p className="text-muted-foreground">
                  Hunt for "Evil Twin" Wi-Fi networks, scan security logs for anomalies, and stay updated with a live threat intelligence feed.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your conversations are your own. We prioritize your privacy and do not store your chat history. Analyze threats with peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 md:py-24">
            <div className="container text-center">
                 <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-transparent shadow-2xl">
                    <CardContent className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Digital Life?</h2>
                        <p className="text-muted-foreground mb-6">
                            Join thousands of users who trust CyGuard for proactive threat detection. Sign up now and get instant access to your personal AI security assistant.
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/signup">Sign Up Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CyGuard. All rights reserved.</p>
           <div className="flex items-center mt-4 md:mt-0">
                <Button variant="link" size="sm" asChild><Link href="#">Terms of Service</Link></Button>
                <Button variant="link" size="sm" asChild><Link href="#">Privacy Policy</Link></Button>
            </div>
        </div>
      </footer>
    </div>
  );
}
