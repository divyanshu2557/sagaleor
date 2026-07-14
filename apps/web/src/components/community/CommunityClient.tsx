"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, Loader2, Trash2, UserPlus, UserCheck } from "lucide-react";
import { createPost, likePost, addComment, deletePost, toggleFollow } from "@/actions/community";
import { AnimatePresence, motion } from "framer-motion";

function formatContent(text: string) {
  return text.split(/(\s+)/).map((word, i) => {
    if (word.startsWith("#")) {
      return <span key={i} className="text-primary font-medium hover:underline cursor-pointer">{word}</span>;
    }
    return word;
  });
}

export function CommunityClient({ 
  initialPosts, 
  currentUserId,
  initialFollowingIds 
}: { 
  initialPosts: any[];
  currentUserId: string | null;
  initialFollowingIds: string[];
}) {
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState<string | null>(null);

  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set(initialFollowingIds));
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    
    const res = await createPost(content, imageUrl || undefined);
    if (res.success && res.post) {
      setPosts([{ ...res.post, comments: [] }, ...posts]);
      setContent("");
      setImageUrl("");
    }
    
    setIsPosting(false);
  };

  const handleLike = async (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    await likePost(postId);
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    setIsCommenting(postId);

    const res = await addComment(postId, commentText);
    if (res.success && res.comment) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), res.comment] };
        }
        return p;
      }));
      setCommentText("");
    }
    setIsCommenting(null);
  };

  const handleDelete = async (postId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;
    
    setPosts(posts.filter(p => p.id !== postId));
    await deletePost(postId);
    setMenuOpenId(null);
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/community/post/${postId}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const handleFollow = async (targetUserId: string) => {
    const isCurrentlyFollowing = followingIds.has(targetUserId);
    
    // Optimistic UI
    const newFollowing = new Set(followingIds);
    if (isCurrentlyFollowing) {
      newFollowing.delete(targetUserId);
    } else {
      newFollowing.add(targetUserId);
    }
    setFollowingIds(newFollowing);

    const res = await toggleFollow(targetUserId);
    if (!res.success) {
      // Revert on failure
      const reverted = new Set(followingIds);
      if (isCurrentlyFollowing) reverted.add(targetUserId);
      else reverted.delete(targetUserId);
      setFollowingIds(reverted);
    }
  };

  const displayPosts = posts.filter(post => {
    if (activeTab === "following") {
      return followingIds.has(post.userId) || post.userId === currentUserId;
    }
    if (activeTab === "challenges") {
      return false; // Show nothing for now, or you can filter by #challenge
    }
    return true; // "for-you" and "trending"
  }).sort((a, b) => {
    if (activeTab === "trending") {
      return b.likes - a.likes;
    }
    return 0; // Default sort is by createdAt desc from server
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto relative pb-20">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border text-sm font-medium overflow-x-auto scrollbar-hide -mt-4 mb-6">
        {[
          { id: "for-you", label: "For You" },
          { id: "following", label: "Following" },
          { id: "trending", label: "Trending" },
          { id: "challenges", label: "Challenges" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-lg z-50 text-sm font-medium"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post */}
      <div className="bg-card rounded-3xl border border-border/50 p-5 shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an outfit, ask for advice, or post a trend (try using #hashtags)..."
          className="w-full bg-transparent border-none focus:ring-0 text-foreground resize-none h-20 placeholder:text-muted-foreground"
        />
        {imageUrl && (
          <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden border border-border">
            <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
            <button onClick={() => setImageUrl("")} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs">✕</button>
          </div>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <ImageIcon className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Image URL" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-48 bg-secondary border-none rounded-lg text-xs px-2 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
              />
            </div>
          </div>
          <button 
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post
          </button>
        </div>
      </div>

      {/* Feed */}
      {displayPosts.map((post) => {
        const isMyPost = post.userId === currentUserId;
        const isFollowing = followingIds.has(post.userId);

        return (
          <motion.div 
            key={post.id} 
            layout
            className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm relative"
          >
            {/* Post Header */}
            <div className="p-5 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium">
                  {post.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{post.user?.name || "User"}</p>
                    {!isMyPost && currentUserId && (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <button 
                          onClick={() => handleFollow(post.userId)}
                          className={`text-xs font-medium flex items-center gap-1 transition-colors ${isFollowing ? 'text-muted-foreground' : 'text-primary'}`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                  className="text-muted-foreground hover:bg-secondary p-2 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {menuOpenId === post.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-10 w-40 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20"
                    >
                      {isMyPost ? (
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-secondary transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Post
                        </button>
                      ) : (
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                          Report Post
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-4">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{formatContent(post.content)}</p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="w-full max-h-[500px] border-y border-border/50 overflow-hidden bg-secondary/50 flex items-center justify-center">
                <img src={post.imageUrl} alt="Post content" className="w-full max-h-[500px] object-contain" />
              </div>
            )}

            {/* Post Actions */}
            <div className="px-5 py-4 flex items-center gap-6">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors group"
              >
                <Heart className="w-5 h-5 group-hover:fill-current" />
                <span className="text-sm font-medium">{post.likes}</span>
              </motion.button>
              <button 
                onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                className={`flex items-center gap-2 transition-colors ${expandedPostId === post.id ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.comments?.length || 0}</span>
              </button>
              <button 
                onClick={() => handleShare(post.id)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Expandable Comments Section */}
            <AnimatePresence>
              {expandedPostId === post.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50 bg-secondary/30"
                >
                  <div className="p-5 space-y-4">
                    {/* Existing Comments */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {post.comments?.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
                      ) : (
                        post.comments?.map((comment: any) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                              {comment.user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 bg-card border border-border/50 rounded-2xl p-3 shadow-sm text-sm">
                              <span className="font-medium mr-2">{comment.user?.name}</span>
                              <span className="text-muted-foreground/80">{comment.text}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-card border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post.id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleComment(post.id)}
                        disabled={!commentText.trim() || isCommenting === post.id}
                        className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {isCommenting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      
      {displayPosts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {activeTab === "challenges" 
            ? "No challenges right now. Check back later!" 
            : activeTab === "following" 
              ? "You aren't following anyone with posts yet." 
              : "No posts yet. Be the first to share your style!"}
        </div>
      )}
    </div>
  );
}
