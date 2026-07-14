"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
        comments: {
          include: {
            user: { select: { name: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
    });
    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { error: "Failed to fetch posts" };
  }
}

export async function createPost(content: string, imageUrl?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content,
        imageUrl,
      },
      include: {
        user: { select: { name: true } },
      }
    });

    revalidatePath("/community");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}

export async function likePost(postId: string) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    revalidatePath("/community");
    return { success: true, post };
  } catch (error) {
    console.error("Error liking post:", error);
    return { error: "Failed to like post" };
  }
}

export async function addComment(postId: string, text: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: user.id,
        text
      },
      include: {
        user: { select: { name: true } }
      }
    });

    revalidatePath("/community");
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: "Post not found" };

    if (post.userId !== user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post" };
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { following: true }
    });
    if (!currentUser) return { error: "User not found" };

    if (currentUser.id === targetUserId) {
      return { error: "Cannot follow yourself" };
    }

    const isFollowing = currentUser.following.some(u => u.id === targetUserId);

    if (isFollowing) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            disconnect: { id: targetUserId }
          }
        }
      });
    } else {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            connect: { id: targetUserId }
          }
        }
      });
    }

    revalidatePath("/community");
    return { success: true, isFollowing: !isFollowing };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { error: "Failed to toggle follow" };
  }
}
