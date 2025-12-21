const MARTHA_BASE = "http://martha.jh.shawinigan.info/queries";

export async function marthaPost(queryName, { auth, body } = {}) {
  const url = `${MARTHA_BASE}/${encodeURIComponent(queryName)}/execute`;

  try {
    const headers = { "Content-Type": "application/json" };
    if (auth) headers["auth"] = String(auth).trim();

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} — ${text || "Erreur réseau"}`
      );
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Requête Martha échouée");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Erreur inconnue lors de la requête");
  }
}