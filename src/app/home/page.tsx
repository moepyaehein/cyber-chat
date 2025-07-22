
import AppLayout from "@/components/cyguard/AppLayout";
import ChatInterface from "@/components/cyguard/ChatInterface";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="container mx-auto h-full max-w-4xl flex flex-col py-4 md:py-6">
        <ChatInterface />
      </div>
    </AppLayout>
  );
}
