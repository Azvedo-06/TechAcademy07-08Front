import { API_URL } from "./config";
import { getToken, clearToken, saveToken } from "./authStorage";
import { jwtDecode } from "jwt-decode";

async function fetchWithTimeout(resource, { timeout = 8000, ...options } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchAuth(resource, options = {}) {
  const token = await getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  return fetchWithTimeout(resource, {
    ...options,
    headers,
  });
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error || json?.message || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

// ---- Endpoints ---- //

// --- Login --- //
export default async function login(email, password) {
  const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer login");
  }

  if (!data.token) {
    throw new Error("Servidor não retornou token!");
  }
  await saveToken(data.token);
  return {
    token: data.token,
  };
}

export async function logout() {
  await clearToken();
}

export const getLoggedUser = async () => {
  try {
    const token = await getToken("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

// --- Users --- //
export async function getUsers() {
  const res = await fetchAuth(`${API_URL}/users`, { timeout: 8000 });
  return handleResponse(res);
}

export async function createUsers(usuario) {
  const res = await fetchAuth(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return handleResponse(res);
}

export async function deleteUsers(id) {
  const res = await fetchAuth(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function updateUsers(id, dadosAtualizados) {
  const res = await fetchAuth(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Eventos ---- //
export async function getEvents() {
  const res = await fetchAuth(`${API_URL}/events`, { timeout: 8000 });
  return handleResponse(res);
}

export async function createEvent(event) {
  const res = await fetchAuth(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return handleResponse(res);
}

export async function deleteEvent(id) {
  const res = await fetchAuth(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function updateEvent(id, dadosAtualizados) {
  const res = await fetchAuth(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Informativos ---- //
// export async function getInformativos() {
//   const res = await fetchAuth(`${API_URL}/informativos`, {
//     timeout: 8000,
//   });
//   return handleResponse(res);
// }

// export async function deleteInformativos(id) {
//   const res = await fetchAuth(`${API_URL}/informativos/${id}`, {
//     method: "DELETE",
//   });
//   return handleResponse(res);
// }

// export async function createInformativos(informativo) {
//   const res = await fetchAuth(`${API_URL}/informativos`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(informativo),
//   });
//   return handleResponse(res);
// }

// export async function updateInformativos(id, dadosAtualizados) {
//   const res = await fetchAuth(`${API_URL}/informativos/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dadosAtualizados),
//   });
//   return handleResponse(res);
//}

// ---- Espaços ---- //
export async function getSpaces() {
  const res = await fetchAuth(`${API_URL}/spaces`, { timeout: 8000 });
  return handleResponse(res);
}

export async function deleteSpaces(id) {
  const res = await fetchAuth(`${API_URL}/spaces/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function createSpaces(espaco) {
  const res = await fetchAuth(`${API_URL}/spaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(espaco),
  });
  return handleResponse(res);
}

export async function updateSpaces(id, dadosAtualizados) {
  const res = await fetchAuth(`${API_URL}/spaces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Atividades ---- //
// export async function getactivities() {
//   const res = await fetchAuth(`${API_URL}/activities`, {
//     timeout: 8000,
//   });
//   return handleResponse(res);
// }

// export async function deleteactivities(id) {
//   const res = await fetchAuth(`${API_URL}/activities/${id}`, {
//     method: "DELETE",
//   });
//   return handleResponse(res);
// }

// export async function createactivities(atividade) {
//   const res = await fetchAuth(`${API_URL}/activities`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(atividade),
//   });
//   return handleResponse(res);
// }

// export async function updateactivities(id, dadosAtualizados) {
//   const res = await fetchAuth(`${API_URL}/activities/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dadosAtualizados),
//   });
//   return handleResponse(res);
// }
