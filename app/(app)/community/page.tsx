"use client"

import { useState } from "react"
import type { CommunityPost, CommunityChannel, CommunityComment } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Users,
  MessageSquare,
  Heart,
  Flag,
  Send,
  Hash,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { demoCommunityPosts, getDemoCommunityChannels } from "@/lib/data/demo-data"

export default function CommunityPage() {
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [posts, setPosts] = useState<CommunityPost[]>(demoCommunityPosts)
  const [newPost, setNewPost] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const channels: CommunityChannel[] = getDemoCommunityChannels(posts)

  const filteredPosts = posts.filter((p) => p.channelId === selectedChannel)
  const selectedChannelData = channels.find((c) => c.id === selectedChannel)

  function handlePost() {
    if (!newPost.trim()) return
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      channelId: selectedChannel,
      author: isAnonymous ? "Anonymous" : "You",
      isAnonymous,
      content: newPost.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    }
    setPosts((prev) => [post, ...prev])
    setNewPost("")
    toast.success("Post shared!")
  }

  function handleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    )
  }

  function handleComment(postId: string) {
    const text = commentInputs[postId]
    if (!text?.trim()) return
    const comment: CommunityComment = {
      id: `comment-${Date.now()}`,
      author: isAnonymous ? "Anonymous" : "You",
      isAnonymous,
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    )
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
  }

  function handleReport(postId: string) {
    toast.info("Post reported. Our team will review it.")
  }

  return (
    <div className="flex flex-col gap-4 pb-24 md:pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground">Connect with other expecting and new mothers</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="hidden w-60 shrink-0 md:block">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <Hash className="h-4 w-4 text-primary" />
                Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="flex flex-col gap-0.5">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedChannel === channel.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span>{channel.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {channel.postCount}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile channel selector */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {selectedChannelData?.name || "Select Channel"}
              </span>
              {sidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {sidebarOpen && (
              <Card className="mt-2 border-border">
                <CardContent className="p-2">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannel(channel.id)
                        setSidebarOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedChannel === channel.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <span>{channel.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {channel.postCount}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* New post */}
          <Card className="border-border">
            <CardContent className="flex flex-col gap-3 py-4">
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={`Share something in #${selectedChannelData?.name || "general"}...`}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="anonymous" className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer">
                    <EyeOff className="h-3 w-3" />
                    Post anonymously
                  </Label>
                </div>
                <Button size="sm" onClick={handlePost} disabled={!newPost.trim()} className="gap-2">
                  <Send className="h-3 w-3" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Post feed */}
          <div className="flex flex-col gap-3">
            {filteredPosts.length === 0 ? (
              <Card className="border-border">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">No posts yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share in this channel
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="border-border">
                  <CardContent className="flex flex-col gap-3 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {post.isAnonymous ? (
                            <EyeOff className="h-4 w-4 text-primary" />
                          ) : (
                            <Users className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{post.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleReport(post.id)}
                        aria-label="Report post"
                      >
                        <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed">{post.content}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {post.comments.length} {post.comments.length === 1 ? "reply" : "replies"}
                      </button>
                    </div>

                    {/* Comments */}
                    {expandedComments[post.id] && (
                      <div className="flex flex-col gap-3 pt-2">
                        <Separator />
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2 pl-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                              {comment.isAnonymous ? (
                                <EyeOff className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <Users className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-foreground">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pl-4">
                          <Input
                            placeholder="Write a reply..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleComment(post.id)
                            }}
                            className="text-xs"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleComment(post.id)}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
