import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MessagesClient } from "@/components/messages/MessagesClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // @ts-ignore
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch conversations
  // @ts-ignore
  let conversations = await prisma.conversation.findMany({
    where: { participantId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get the latest message for the sidebar
      }
    },
    orderBy: { updatedAt: "desc" },
  });

  // If no conversations, seed them
  if (conversations.length === 0) {
    const mockUsers = [
      { name: "Meera Kapoor", avatar: "https://i.pravatar.cc/150?img=32", isAI: false, msg: "What about this for the brunch? 🤔" },
      { name: "AI Stylist", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80", isAI: true, msg: "I've updated your style profile!" },
      { name: "Priya Shah", avatar: "https://i.pravatar.cc/150?img=44", isAI: false, msg: "Thanks for the outfit inspo! 🙏" },
    ];

    for (const mock of mockUsers) {
      // @ts-ignore
      const c = await prisma.conversation.create({
        data: {
          participantId: user.id,
          otherName: mock.name,
          otherAvatar: mock.avatar,
          isAI: mock.isAI,
        }
      });
      // @ts-ignore
      await prisma.message.create({
        data: {
          conversationId: c.id,
          sender: "OTHER",
          text: mock.msg,
        }
      });
    }

    // Refetch after seeding
    // @ts-ignore
    conversations = await prisma.conversation.findMany({
      where: { participantId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        }
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  // Fetch all messages for all conversations to pass initially
  // Real app might load lazily, but this is fine for this scale
  const messagesMap: Record<string, any[]> = {};
  for (const convo of conversations) {
    // @ts-ignore
    const msgs = await prisma.message.findMany({
      where: { conversationId: convo.id },
      orderBy: { createdAt: "asc" },
    });
    messagesMap[convo.id] = msgs;
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Chat with friends, stylists, and the community.</p>
      </div>

      <MessagesClient 
        initialConversations={conversations} 
        initialMessagesMap={messagesMap} 
      />
    </div>
  );
}
