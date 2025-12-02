const BASE = "http://martha.jh.shawinigan.info/queries";
const AUTH = "dGVhbTM6RDMzOTNjMjkyMzI2MDg3ZUkwNjk0NDM3YjU1OA==";

async function callQuery(name, body) {
  const res = await fetch(`${BASE}/${name}/execute`, {
    method: "POST",
    headers: {
      auth: AUTH,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(r => r.json());

  if (!res.success) throw new Error(res.error || "Query failed");
  return res;
}

export async function signupUser(email, password, username) {
  return await callQuery("insert-user", { email, password, username });
}

export async function loginUser(email, password) {
  return await callQuery("select-user-auth", { email, password });
}

export async function getProfile(id) {
  return await callQuery("get-profile", { id });
}

export async function updateProfile({ id, height, sexe, goal }) {
  return await callQuery("update-profile", {
    id,
    height,
    sexe,
    goal
  });
}
