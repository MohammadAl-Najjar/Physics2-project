export const fetchPosts = async () => {
  const res = await fetch("/api/posts");
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return await res.json();
};

export const fetchPostById = async (id) => {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) {
    throw new Error("Post not found");
  }
  return await res.json();
};

export const createPost = async (formData) => {
  const res = await fetch("/api/posts", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (res.status === 401) {
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Failed to create post");
  }
  return await res.json();
};
export const fetchMyPosts = async () => {
  const res = await fetch("/api/posts/user/me");
  console.log(res);
  if (res.status === 401) {
    throw new Error("Session expired");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch my posts");
  }
  return await res.json();
};
