export const handleLoginSubmit = async (e, setError, refreshSession) => {
  e.preventDefault();
  setError(null);

  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log(data);
      setError(data.err || "Login failed");
      return;
    }

    await refreshSession();
  } catch (err) {
    setError("Network error. Please try again later.");
  }
};

export const handleRegisterSubmit = async (e, setError, refreshSession) => {
  e.preventDefault();
  setError(null);

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const code = formData.get("code");

  const bodyData = { name, email, password, role };
  if (role === "instructor") {
    bodyData.code = code;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.err || "Sign in failed");
      return;
    }

    await refreshSession();
  } catch (err) {
    setError("Network error. Please try again later.");
  }
};
