import type { BlogDiscussion, BlogPost, BlogResource } from "@/lib/types/portfolio";

export const popularTags: string[] = [
  "ai",
  "webdev",
  "programming",
  "javascript",
  "python",
  "devops",
  "tutorial",
  "security",
  "beginners",
  "opensource",
  "automation",
  "api",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "queues-outlive-the-request",
    badge: "From the backend notebook",
    author: { name: "Israel", role: "Full-Stack Developer" },
    date: "Sep 16",
    title: "Why background jobs outlive the request that started them",
    tags: ["discuss", "nodejs", "bullmq"],
    reactions: 142,
    comments: 27,
    views: 3840,
    readTime: "9 min read",
    summary: "A request should answer fast. Anything that doesn't need to block the response belongs in a queue.",
    reactionBreakdown: [
      { emoji: "❤️", count: 78 },
      { emoji: "🦄", count: 31 },
      { emoji: "🤯", count: 19 },
      { emoji: "🔥", count: 14 },
    ],
    body: [
      "Every request handler I write starts the same way: figure out what actually has to finish before the response goes out, and push everything else somewhere else.",
      "Sending a welcome email, resizing an upload, recalculating a seller's rating — none of that needs the client to wait. It needs to happen reliably, which is a different problem than happening immediately.",
      "That's where a queue like BullMQ earns its keep. The HTTP request enqueues a job and returns in milliseconds. A worker process, running separately from the web server, picks the job up, retries it if it fails, and reports back through whatever channel makes sense — a webhook, a status row, a socket event.",
      "The failure mode I've seen most often is treating the queue as an afterthought: no retry policy, no dead-letter handling, no idea what happens if the worker crashes mid-job. Once a system has background jobs, the jobs are part of the architecture, not a implementation detail you bolt on later.",
      "The rule I keep coming back to: if losing it silently would hurt, it needs a queue with retries and monitoring — not a fire-and-forget promise inside a request handler.",
    ],
  },
  {
    slug: "connection-pooling-diagrammed",
    author: { name: "Israel", role: "Full-Stack Developer" },
    date: "Sep 12",
    title: "Postgres connection pooling, explained with diagrams",
    tags: ["postgres", "backend", "tutorial"],
    reactions: 98,
    comments: 19,
    views: 2510,
    readTime: "11 min read",
    summary: "Every Postgres connection costs real memory on the server. Pooling is how you stop paying for connections you aren't using.",
    reactionBreakdown: [
      { emoji: "❤️", count: 52 },
      { emoji: "🙌", count: 24 },
      { emoji: "🔥", count: 22 },
    ],
    body: [
      "Postgres forks a backend process per connection. That's cheap to reason about and expensive at scale — a few thousand idle connections can eat gigabytes of RAM before a single query runs.",
      "A connection pool sits between the app and the database, keeping a small set of real connections open and handing them out to whichever request needs one. When a request finishes, the connection goes back to the pool instead of closing.",
      "Where this gets interesting is pooling mode. Session mode gives a request the connection for its full lifetime — safe for anything, including advisory locks and prepared statements. Transaction mode hands the connection back the moment a transaction commits, which multiplexes far more clients onto the same number of real connections, but breaks anything that depends on session state surviving between statements.",
      "Supabase's pooler runs in transaction mode by default, which is why prepared statements have to be disabled in the driver — the next statement on that logical connection might physically land on a different backend process entirely.",
      "The practical takeaway: pick the pool size based on what the database can actually hold, not how many requests you expect concurrently. A pool that's too large just moves the queueing from your app to Postgres itself.",
    ],
  },
  {
    slug: "marketplace-race-conditions",
    badge: "Lessons from a production incident",
    author: { name: "Israel", role: "Full-Stack Developer" },
    date: "Sep 8",
    title: "The race condition that shipped two orders for one seat",
    tags: ["discuss", "architecture", "debugging"],
    reactions: 176,
    comments: 41,
    views: 5120,
    readTime: "7 min read",
    summary: "Two checkout requests landed in the same millisecond. The read-then-write check in between wasn't atomic, and the database let both through.",
    reactionBreakdown: [
      { emoji: "😱", count: 61 },
      { emoji: "❤️", count: 49 },
      { emoji: "🔥", count: 38 },
      { emoji: "🙌", count: 28 },
    ],
    body: [
      "The bug report was simple: a customer got charged for a seat that had already been sold to someone else. The code that checked availability looked correct — read the seat's status, confirm it's open, write 'sold'.",
      "The problem was the gap between the read and the write. Under enough concurrent load, two checkout requests read 'available' before either one had written 'sold'. Both proceeded. Both charged a card.",
      "The fix wasn't more validation in the application layer — validation running against a stale read is still validation against a stale read, no matter how many checks you stack on top of it. The fix was pushing the check into the same statement as the write, using a conditional update with `WHERE status = 'available'` and checking the row count that came back.",
      "If zero rows were affected, the seat was already gone, and the app could return a clean 'sold out' instead of a duplicate charge. Postgres's row-level locking made the check-and-set atomic — no window for a second request to slip through.",
      "The broader lesson: any 'check, then act' logic that spans two separate database round-trips has a race condition in it by default. The question isn't whether it's a bug — it's whether traffic is high enough yet to notice.",
    ],
  },
  {
    slug: "ci-cd-without-the-yaml-maze",
    author: { name: "Israel", role: "Full-Stack Developer" },
    date: "Sep 2",
    title: "Getting CI/CD pipelines out of the copy-paste YAML maze",
    tags: ["devops", "aws", "automation"],
    reactions: 64,
    comments: 12,
    views: 1370,
    readTime: "6 min read",
    summary: "Every workflow file had the same seven steps pasted into it. Reusable workflows turned seven copies into one.",
    reactionBreakdown: [
      { emoji: "🙌", count: 30 },
      { emoji: "❤️", count: 21 },
      { emoji: "🔥", count: 13 },
    ],
    body: [
      "The pipeline started as one workflow file. Then a second service needed the same build-test-deploy steps, so it got copied. Then a third. By the time there were seven, changing the Node version meant editing seven files and hoping none of them drifted.",
      "The fix was pulling the shared steps into a reusable workflow — checkout, install, test, build, push the image, deploy — parameterized by service name and environment. Each service's workflow file shrank down to a single call with its own inputs.",
      "The other change was separating 'build once' from 'deploy many times'. The image gets built and tagged with the commit SHA exactly once; staging and production both deploy that same artifact instead of rebuilding it, which closes off an entire category of 'it worked in staging' surprises caused by a dependency updating between the two builds.",
      "None of this required a new platform or a rewrite — just refusing to let the seventh copy-paste happen and extracting the pattern instead.",
    ],
  },
];

export const activeDiscussions: BlogDiscussion[] = [
  {
    title: "The race condition that shipped two orders for one seat",
    comments: 41,
    href: "/blog/marketplace-race-conditions",
  },
  {
    title: "Why background jobs outlive the request that started them",
    comments: 27,
    href: "/blog/queues-outlive-the-request",
  },
  {
    title: "Postgres connection pooling, explained with diagrams",
    comments: 19,
    href: "/blog/connection-pooling-diagrammed",
  },
];

export const trendingResources: BlogResource[] = [
  {
    title: "A checklist for reviewing someone else's Docker setup",
    href: "#blog",
  },
  {
    title: "The npm audit report nobody reads (and why that's a problem)",
    href: "#blog",
  },
  {
    title: "Redis as a queue: when it's the right tool, when it isn't",
    href: "#blog",
  },
];
