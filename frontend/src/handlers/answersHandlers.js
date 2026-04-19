export const fetchAnswers = async (postId) => {
  const res = await fetch(`/api/posts/${postId}/answers`);
  if (!res.ok) {
    throw new Error("Failed to fetch answers");
  }
  const data = await res.json();
  return data.answers || [];
};

export const createAnswer = async (postId, body) => {
  const res = await fetch(`/api/posts/${postId}/answers`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (res.status === 401) {
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.err || "Failed to post reply");
  }
  return await res.json();
};
export const fetchMyAnswers = async () => {
  const res = await fetch(`/api/user/answers`);
  if (res.status === 401) {
    throw new Error("Session expired");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch my answers");
  }
  const data = await res.json();
  return data.answers || [];
};
