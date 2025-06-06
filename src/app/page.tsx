import PageHeader from '@/components/cyguard/PageHeader';
import ChatInterface from '@/components/cyguard/ChatInterface';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader />
      <main className="flex-grow overflow-hidden">
        <div className="container mx-auto h-full max-w-3xl flex flex-col">
           <ChatInterface />
        </div>
      </main>
    </div>
  );
}
