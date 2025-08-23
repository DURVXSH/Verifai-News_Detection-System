import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft,
  Home,
  Info,
  Camera,
  Newspaper,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Hash,
  Trash2,
  AlertTriangle,
  Search,
  Clock,
  Reply,
  X,
  Brain,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileSidebar } from '@/components/MobileSidebar';
import { UserNav } from '@/components/UserNav';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';
import { 
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  where,
  getDocs,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { improveText, suggestReply, moderateContent } from '@/utils/geminiHelper';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
  likes: string[];
  dislikes: string[];
  tags: string[];
  imageUrl?: string;
}

interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
  likes: string[];
  dislikes: string[];
  replies?: Comment[];
}

export const SocialPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [charCount, setCharCount] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(null);
  const [editingComment, setEditingComment] = useState<{ commentId: string; postId: string } | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showCommentDeleteDialog, setShowCommentDeleteDialog] = useState<{ commentId: string; postId: string } | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostTags, setEditPostTags] = useState<string[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isSuggestingReply, setIsSuggestingReply] = useState<string | null>(null);
  const [isModeratingContent, setIsModeratingContent] = useState(false);
  const [moderationResult, setModerationResult] = useState<{
    isAppropriate: boolean;
    reason?: string;
    suggestedRevision?: string;
  } | null>(null);

  const availableTags = [
    'News', 'Politics', 'Technology', 'Health', 'Science',
    'Business', 'Entertainment', 'Sports', 'Education', 'Environment'
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Post[];
      setPosts(newPosts);
      setLoading(false);
    }, (err) => {
      setError(t('Failed to load posts. Please try again.'));
      setLoading(false);
      console.error('Posts fetch error:', err);
    });

    return () => unsubscribe();
  }, [user, t]);

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    setSortedPosts(sorted);
  }, [posts]);

  useEffect(() => {
    if (!user || posts.length === 0) return;

    const unsubscribeComments = posts.map(post => {
      const commentsRef = collection(db, 'posts', post.id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const postComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          likes: doc.data().likes || [],
          dislikes: doc.data().dislikes || [],
          replies: []
        })) as Comment[];

        const nestedComments = postComments.reduce((acc, comment) => {
          if (!comment.parentId) {
            acc.push({
              ...comment,
              replies: getReplies(postComments, comment.id)
            });
          }
          return acc;
        }, [] as Comment[]);

        setComments(prev => ({
          ...prev,
          [post.id]: nestedComments
        }));
      }, (err) => {
        console.error(`Comments fetch error for post ${post.id}:`, err);
      });
    });

    return () => unsubscribeComments.forEach(unsubscribe => unsubscribe());
  }, [user, posts]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      const gridSize = 4;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const horizontalLines = Math.floor(viewportHeight / (gridSize * 16));
      const verticalLines = Math.floor(viewportWidth / (gridSize * 16));
      
      const sparkleCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < sparkleCount; i++) {
        const isHorizontal = Math.random() > 0.5;
        
        if (isHorizontal) {
          const lineIndex = Math.floor(Math.random() * horizontalLines);
          newSparkles.push({
            id: `sparkle-${Date.now()}-${i}`,
            x: Math.random() * viewportWidth,
            y: lineIndex * gridSize * 16,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 2 + 1,
            direction: Math.random() > 0.5 ? 1 : -1,
            isHorizontal: true,
          });
        } else {
          const lineIndex = Math.floor(Math.random() * verticalLines);
          newSparkles.push({
            id: `sparkle-${Date.now()}-${i}`,
            x: lineIndex * gridSize * 16,
            y: Math.random() * viewportHeight,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 2 + 1,
            direction: Math.random() > 0.5 ? 1 : -1,
            isHorizontal: false,
          });
        }
      }
      
      setSparkles(newSparkles);
    };
    
    generateSparkles();
    const interval = setInterval(generateSparkles, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sparkles.length === 0) return;
    
    const animateSparkles = () => {
      setSparkles(prevSparkles => 
        prevSparkles.map(sparkle => {
          if (sparkle.isHorizontal) {
            let newX = sparkle.x + (sparkle.speed * sparkle.direction);
            if (newX < 0 || newX > window.innerWidth) {
              sparkle.direction *= -1;
              newX = sparkle.x + (sparkle.speed * sparkle.direction);
            }
            return { ...sparkle, x: newX };
          } else {
            let newY = sparkle.y + (sparkle.speed * sparkle.direction);
            if (newY < 0 || newY > window.innerHeight) {
              sparkle.direction *= -1;
              newY = sparkle.y + (sparkle.speed * sparkle.direction);
            }
            return { ...sparkle, y: newY };
          }
        })
      );
    };
    
    const animationFrame = requestAnimationFrame(animateSparkles);
    const interval = setInterval(animateSparkles, 50);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [sparkles]);

  const getReplies = (comments: Comment[], parentId: string): Comment[] => {
    const replies = comments.filter(comment => comment.parentId === parentId);
    return replies.map(reply => ({
      ...reply,
      replies: getReplies(comments, reply.id)
    }));
  };

  const filteredPosts = sortedPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handlePost = async () => {
    if (!user || !newPost.trim() || charCount > 280) return;

    setLoading(true);
    setError(null);
    setIsModeratingContent(true);

    try {
      const moderation = await moderateContent(newPost);
      setModerationResult(moderation);

      if (!moderation.isAppropriate) {
        setError(moderation.reason || t('Content was flagged as inappropriate.'));
        setIsModeratingContent(false);
        setLoading(false);
        return;
      }

      const finalContent = moderation.suggestedRevision || newPost;

      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName || user.email,
        content: finalContent,
        createdAt: serverTimestamp(),
        likes: [],
        dislikes: [],
        tags: selectedTags
      });

      setNewPost('');
      setSelectedTags([]);
      setCharCount(0);
      setModerationResult(null);
    } catch (err) {
      console.error('Post creation error:', err);
      setError(t('Failed to create post. Please try again.'));
    } finally {
      setIsModeratingContent(false);
      setLoading(false);
    }
  };

  const handleImproveText = async (text: string) => {
    setIsImproving(true);
    try {
      const improvedText = await improveText(text);
      setNewPost(improvedText);
      setCharCount(improvedText.length);
    } catch (error) {
      console.error('Text improvement failed:', error);
      setError(t('Failed to improve text. Please try again.'));
    } finally {
      setIsImproving(false);
    }
  };

  const handleSuggestReply = async (postId: string, originalPost: string, previousComments: string[] = []) => {
    setIsSuggestingReply(postId);
    try {
      const suggestedReply = await suggestReply(originalPost, previousComments);
      setNewComment({ ...newComment, [postId]: suggestedReply });
    } catch (error) {
      console.error('Reply suggestion failed:', error);
      setError(t('Failed to suggest reply. Please try again.'));
    } finally {
      setIsSuggestingReply(null);
    }
  };

  const handleEditPost = async (postId: string) => {
    if (!user || !editPostContent.trim()) return;
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        content: editPostContent.trim(),
        tags: editPostTags,
        updatedAt: serverTimestamp()
      });
      setEditingPost(null);
      setEditPostContent('');
      setEditPostTags([]);
    } catch (err) {
      console.error('Post edit error:', err);
      alert(t('Error editing post.'));
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        dislikes: arrayRemove(user.uid)
      });
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDislike = async (postId: string, isDisliked: boolean) => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        dislikes: isDisliked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: arrayRemove(user.uid)
      });
    } catch (err) {
      console.error('Dislike error:', err);
    }
  };

  const handleCommentLike = async (postId: string, commentId: string, isLiked: boolean) => {
    if (!user) return;
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        dislikes: arrayRemove(user.uid)
      });
    } catch (err) {
      console.error('Comment like error:', err);
    }
  };

  const handleCommentDislike = async (postId: string, commentId: string, isDisliked: boolean) => {
    if (!user) return;
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        dislikes: isDisliked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: arrayRemove(user.uid)
      });
    } catch (err) {
      console.error('Comment dislike error:', err);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);

      const commentsRef = collection(db, 'posts', postId, 'comments');
      const commentsQuery = query(commentsRef);
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      const postRef = doc(db, 'posts', postId);
      batch.delete(postRef);

      await batch.commit();

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setComments(prevComments => {
        const newComments = { ...prevComments };
        delete newComments[postId];
        return newComments;
      });

      setShowDeleteDialog(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error 
        ? error.message.includes('permission-denied')
          ? (i18n.language === 'gu' ? 'પરવાનગી નામંજૂર.' : 
             i18n.language === 'hi' ? 'अनुमति अस्वीकृत।' : 
             i18n.language === 'mr' ? 'परवानगी नाकारली.' : 
             'Permission denied.')
          : (i18n.language === 'gu' ? 'પોસ્ટ કાઢી નાખવામાં ભૂલ થઈ.' : 
             i18n.language === 'hi' ? 'पोस्ट हटाने में त्रुटि।' : 
             i18n.language === 'mr' ? 'पोस्ट हटवताना त्रुटी.' : 
             'Error deleting post.')
        : (i18n.language === 'gu' ? 'અજ્ઞાત ભૂલ.' : 
           i18n.language === 'hi' ? 'अज्ञात त्रुटि।' : 
           i18n.language === 'mr' ? 'अज्ञात त्रुटी.' : 
           'Unknown error.');
      alert(errorMessage);
    }
  };

  const handleEditComment = async (postId: string, commentId: string) => {
    if (!user || !editCommentContent.trim()) return;
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        content: editCommentContent.trim(),
        updatedAt: serverTimestamp()
      });
      setEditingComment(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('Comment edit error:', err);
      alert(t('Error editing comment.'));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!user) return;
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const repliesRef = collection(db, 'posts', postId, 'comments');
      const repliesQuery = query(repliesRef, where('parentId', '==', commentId));
      const repliesSnapshot = await getDocs(repliesQuery);
      const batch = writeBatch(db);
      batch.delete(commentRef);
      repliesSnapshot.forEach(reply => batch.delete(reply.ref));
      await batch.commit();
      setShowCommentDeleteDialog(null);
    } catch (err) {
      console.error('Comment delete error:', err);
      alert(t('Error deleting comment.'));
    }
  };

  const handleShare = async (post: Post) => {
    const shareText = `${post.content}\n\nShared from Verifai`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared Post',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(t('Post copied to clipboard!'));
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCommentChange = (id: string, value: string) => {
    setNewComment(prev => ({ ...prev, [id]: value }));
  };

  const handleAddComment = async (postId: string, parentId: string | null = null) => {
    if (!user) return;
    
    const commentContent = parentId ? newComment[parentId] : newComment[postId];
    if (!commentContent?.trim()) return;

    try {
      const commentData = {
        postId,
        parentId,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        content: commentContent.trim(),
        createdAt: serverTimestamp(),
        likes: [],
        dislikes: []
      };

      const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), commentData);

      setComments(prev => {
        const updatedComments = { ...prev };
        const postComments = updatedComments[postId] || [];
        if (parentId) {
          const parentComment = findComment(postComments, parentId);
          if (parentComment) {
            parentComment.replies = parentComment.replies || [];
            parentComment.replies.push({
              ...commentData,
              id: commentRef.id,
              createdAt: new Date(),
              replies: []
            });
          }
        } else {
          updatedComments[postId] = [
            {
              ...commentData,
              id: commentRef.id,
              createdAt: new Date(),
              replies: []
            },
            ...postComments
          ];
        }
        return updatedComments;
      });

      setNewComment(prev => {
        const updated = { ...prev };
        delete updated[parentId || postId];
        return updated;
      });

      if (parentId) setReplyingTo(null);
    } catch (err) {
      console.error('Comment creation error:', err);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewPost(value);
    setCharCount(value.length);
  };

  const findComment = (comments: Comment[], commentId: string): Comment | null => {
    for (const comment of comments || []) {
      if (comment.id === commentId) return comment;
      if (comment.replies) {
        const found = findComment(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleCommentClick = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const getCommentCount = (postId: string): number => {
    const postComments = comments[postId] || [];
    let count = postComments.length;
    
    postComments.forEach(comment => {
      if (comment.replies) {
        count += comment.replies.length;
      }
    });
    
    return count;
  };

  const renderComments = (comments: Comment[], postId: string, level = 0) => {
    return comments.map(comment => (
      <div 
        key={comment.id}
        className={cn(
          "border-l-2 border-border/50 pl-4",
          level > 0 && "ml-4",
          level >= 3 && "ml-8"
        )}
      >
        <div className="bg-background/50 p-3 rounded-md mb-2 text-sm w-full break-words">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <p className="font-medium">{comment.authorName}</p>
              <p className="text-muted-foreground text-xs">
                {comment.createdAt?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {user?.uid === comment.authorId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingComment({ commentId: comment.id, postId });
                      setEditCommentContent(comment.content);
                    }}
                    className="h-8 px-2"
                  >
                    {t('Edit')}
                  </Button>
                  <Dialog open={showCommentDeleteDialog?.commentId === comment.id} onOpenChange={(open) => !open && setShowCommentDeleteDialog(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommentDeleteDialog({ commentId: comment.id, postId })}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('Confirm Delete Comment')}</DialogTitle>
                      </DialogHeader>
                      <p className="py-4">{t('Are you sure you want to delete this comment?')}</p>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowCommentDeleteDialog(null)}
                        >
                          {t('Cancel')}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteComment(postId, comment.id)}
                        >
                          {t('Delete')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo({ 
                  commentId: comment.id, 
                  authorName: comment.authorName 
                })}
                className="h-8 px-2"
              >
                <Reply className="h-4 w-4 mr-1" />
                {t('Reply')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCommentLike(postId, comment.id, comment.likes?.includes(user?.uid || ''))}
                className={cn(
                  "flex items-center gap-1 h-8 px-2",
                  comment.likes?.includes(user?.uid || '') && "text-primary"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                {comment.likes?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCommentDislike(postId, comment.id, comment.dislikes?.includes(user?.uid || ''))}
                className={cn(
                  "flex items-center gap-1 h-8 px-2",
                  comment.dislikes?.includes(user?.uid || '') && "text-destructive"
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                {comment.dislikes?.length || 0}
              </Button>
            </div>
          </div>
          {editingComment?.commentId === comment.id ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                className="flex-1 p-2 bg-background/80 border border-input rounded-lg focus:ring-0 focus:border-primary text-sm"
              />
              <Button
                size="sm"
                onClick={() => handleEditComment(postId, comment.id)}
                disabled={!editCommentContent.trim()}
              >
                {t('Save')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingComment(null);
                  setEditCommentContent('');
                }}
              >
                {t('Cancel')}
              </Button>
            </div>
          ) : (
            <p className="mt-1 break-words">{comment.content}</p>
          )}
          {replyingTo?.commentId === comment.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newComment[comment.id] || ''}
                onChange={(e) => handleCommentChange(comment.id, e.target.value)}
                placeholder={`${t('Reply to')} ${replyingTo.authorName}...`}
                className="flex-1 p-2 bg-background/80 border border-input rounded-lg focus:ring-0 focus:border-primary text-sm"
              />
              <Button
                size="sm"
                onClick={() => handleAddComment(postId, comment.id)}
                disabled={!newComment[comment.id]?.trim()}
              >
                {t('Reply')}
              </Button>
            </div>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {renderComments(comment.replies, postId, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderPost = (post: Post, index: number) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-lg relative overflow-hidden mb-6",
        expandedPost === post.id && "z-10"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium">{post.authorName}</h3>
          <p className="text-sm text-muted-foreground">
            {post.createdAt?.toLocaleString()}
          </p>
        </div>
        {user?.uid === post.authorId && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingPost(post.id);
                setEditPostContent(post.content);
                setEditPostTags(post.tags || []);
              }}
            >
              {t('Edit')}
            </Button>
            <Dialog open={showDeleteDialog === post.id} onOpenChange={(open) => !open && setShowDeleteDialog(null)}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(post.id)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {i18n.language === 'gu' ? 'પોસ્ટ કાઢી નાખવાની પુષ્ટિ કરો' :
                     i18n.language === 'hi' ? 'पोस्ट हटाने की पुष्टि करें' :
                     i18n.language === 'mr' ? 'पोस्ट हटवण्याची पुष्टी करा' :
                     'Confirm Delete Post'}
                  </DialogTitle>
                </DialogHeader>
                <p className="py-4">
                  {i18n.language === 'gu' ? 'શું તમે ખરેખર આ પોસ્ટ કાઢી નાખવા માંગો છો?' :
                   i18n.language === 'hi' ? 'क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?' :
                   i18n.language === 'mr' ? 'तुम्हाला खरंच ही पोस्ट हटवायची आहे का?' :
                   'Are you sure you want to delete this post?'}
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(null)}
                  >
                    {i18n.language === 'gu' ? 'રદ કરો' :
                     i18n.language === 'hi' ? 'रद्द करें' :
                     i18n.language === 'mr' ? 'रद्द करा' :
                     'Cancel'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    {i18n.language === 'gu' ? 'કાઢી નાખો' :
                     i18n.language === 'hi' ? 'हटाएं' :
                     i18n.language === 'mr' ? 'हटवा' :
                     'Delete'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {editingPost === post.id ? (
        <div className="mb-4">
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            className="w-full h-32 p-4 mb-4 bg-background/80 backdrop-blur-sm rounded-lg border border-input focus:ring-0 focus:border-primary/50 transition-all duration-300 text-base shadow-sm"
            style={{ resize: 'vertical' }}
          />
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleImproveText(editPostContent)}
              disabled={isImproving}
              className="flex items-center gap-2"
            >
              {isImproving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isImproving ? t('Improving...') : t('Improve Text')}
            </Button>
            <div className="text-sm text-muted-foreground">
              {editPostContent.length}/280
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => handleEditPost(post.id)}
              disabled={!editPostContent.trim() || editPostContent.length > 280}
            >
              {t('Save')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingPost(null);
                setEditPostContent('');
                setEditPostTags([]);
              }}
            >
              {t('Cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleLike(post.id, post.likes?.includes(user?.uid || ''))}
          className={cn(
            "flex items-center gap-1",
            post.likes?.includes(user?.uid || '') && "text-primary"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          {post.likes?.length || 0}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDislike(post.id, post.dislikes?.includes(user?.uid || ''))}
          className={cn(
            "flex items-center gap-1",
            post.dislikes?.includes(user?.uid || '') && "text-destructive"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          {post.dislikes?.length || 0}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCommentClick(post.id)}
          className={cn(
            "flex items-center gap-1",
            expandedPost === post.id && "text-primary"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          {getCommentCount(post.id)}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare(post)}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          {t('Share')}
        </Button>
      </div>

      <AnimatePresence>
        {expandedPost === post.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            <div className="pt-4 border-t border-border/20">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder={t('Add a comment...')}
                  className="flex-1 p-2 bg-background/80 border border-input rounded-lg focus:ring-0 focus:border-primary text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddComment(post.id)}
                  disabled={!newComment[post.id]?.trim()}
                >
                  {t('Post')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestReply(
                    post.id,
                    post.content,
                    comments[post.id]?.map(c => c.content) || []
                  )}
                  disabled={isSuggestingReply === post.id}
                  className="flex items-center gap-2"
                >
                  {isSuggestingReply === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  {isSuggestingReply === post.id ? t('Suggesting...') : t('Suggest Reply')}
                </Button>
              </div>

              <div className="space-y-4">
                {comments[post.id]?.length > 0 ? (
                  renderComments(comments[post.id], post.id)
                ) : (
                  <p className="text-sm text.cted-foreground">{t('No comments yet.')}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80" />
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#93c5fd_1px,transparent_1px),linear-gradient(to_bottom,#93c5fd_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear_gradient(to_bottom,#334155_1px,transparent_1px)] opacity-75 transition-opacity duration-300" />
      
      <div className="fixed inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(100%_100%_at_50%_0%,rgba(30,41,59,0.5)_0%,rgba(30,41,59,0)_100%)]" />
      
      <div className="fixed inset-0" />
      
      <div className="fixed inset-0 pointer-events-none z-10">
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-blue-400 dark:bg-blue-500 animate-pulse"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              opacity: sparkle.opacity,
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.size}px rgba(59, 130, 246, 0.5)`,
              transition: 'transform 0.2s linear'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20 w-full max-w-5xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                {t('common.back')}
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard">
                    <Home className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/article-analysis">
                    <Camera className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/news">
                    <Newspaper className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/about">
                    <Info className="h-5 w-5" />
                  </Link>
                </Button>
                <ThemeToggle />
                <UserNav />
              </div>
              <div className="md:hidden">
                <MobileSidebar
                  showHistory={false}
                  onHistoryClick={() => {}}
                />
              </div>
            </div>
          </div>

          <motion.div 
            className="text-center mb-12 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <MessageCircle className="h-12 w-12 text-primary relative" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                {t('Community Feed')}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('Connect with the community and share your insights')}
            </p>
          </motion.div>

          <div className="mb-8">
  <div className="relative flex items-center">
    <Search className="absolute left-4 h-5 w-5 text-primary/70 z-10 transition-colors group-focus-within:text-primary" />
    <input
      type="text"
      placeholder={t('Search posts by content, author, or tags...')}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
    />
  </div>
</div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <textarea
                value={newPost}
                onChange={handleTextChange}
                placeholder={t('Share your thoughts...')}
                className="w-full h-32 p-4 mb-4 bg-background/80 backdrop-blur-sm rounded-lg border border-input focus:ring-0 focus:border-primary/50 transition-all duration-300 text-base shadow-sm relative placeholder:text-muted-foreground/50"
                style={{ resize: 'vertical' }}
              />

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveText(newPost)}
                    disabled={isImproving || !newPost.trim()}
                    className="flex items-center gap-2"
                  >
                    {isImproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isImproving ? t('Improving...') : t('Improve Text')}
                  </Button>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagClick(tag)}
                        className="flex items-center gap-1"
                      >
                        <Hash className="h-3 w-3" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {charCount}/280
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {moderationResult && !moderationResult.isAppropriate && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">{t('Content Moderation Warning')}</h4>
                  <p className="text-sm mb-2">{moderationResult.reason}</p>
                  {moderationResult.suggestedRevision && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t('Suggested Revision')}:</p>
                      <p className="text-sm">{moderationResult.suggestedRevision}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewPost(moderationResult.suggestedRevision!);
                          setCharCount(moderationResult.suggestedRevision!.length);
                          setModerationResult(null);
                        }}
                        className="mt-2"
                      >
                        {t('Use Suggestion')}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handlePost}
                  disabled={!newPost.trim() || loading || charCount > 280 || isModeratingContent}
                  className="relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isModeratingContent ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('Moderating...')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? t('Posting...') : t('Post')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {loading ? (
                <div className="text-center text-muted-foreground">{t('Loading posts...')}</div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  {searchQuery ? t('No posts match your search.') : t('No posts yet. Be the first to post!')}
                </div>
              ) : (
                filteredPosts.map((post, index) => renderPost(post, index))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }
          .max-w-5xl {
            max-width: 100% !important;
            width: 100%;
          }
          .bg-card {
            padding: 1rem;
          }
          textarea, input {
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            padding: 0.5rem;
          }
          .flex.items-center.gap-4 button {
            padding: 0.25rem 0.5rem;
            font-size: clamp(0.75rem, 2vw, 0.875rem);
          }
          .text-4xl {
            font-size: clamp(1.5rem, 5vw, 2.25rem);
          }
          .text-lg {
            font-size: clamp(0.875rem, 3vw, 1.125rem);
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .max-w-5xl {
            max-width: 90%;
          }
          textarea, input {
            font-size: clamp(0.875rem, 2vw, 1rem);
          }
          .flex.items-center.gap-4 button {
            padding: 0.375rem 0.75rem;
          }
        }

        .nested-comments {
          max-width: 100%;
          overflow-x: auto;
        }
        .border-l-2 {
          margin-left: clamp(0.5rem, 2vw, 1rem);
        }
        .ml-4 {
          margin-left: clamp(0.5rem, 2vw, 1rem);
        }
        @media (max-width: 640px) {
          .nested-comments {
            max-width: 90vw;
          }
          .border-l-2, .ml-4 {
            margin-left: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};