import { API_URL } from "./config";

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

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error || json?.message || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

// ---- Endpoints ---- //

// --- Users --- //
export async function getUsers() {
  const res = await fetchWithTimeout(`${API_URL}/users`, { timeout: 8000 });
  return handleResponse(res);
}

export async function createUsers(usuario) {
  const res = await fetchWithTimeout(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return handleResponse(res);
}

export async function deleteUsers(id) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function updateUsers(id, dadosAtualizados) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Eventos ---- //
export async function getEvents() {
  const res = await fetchWithTimeout(`${API_URL}/events`, { timeout: 8000 });
  return handleResponse(res);
}

export async function createEvent(event) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return handleResponse(res);
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function updateEvent(id, dadosAtualizados) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Informativos ---- //
// export async function getInformativos() {
//   const res = await fetchWithTimeout(`${API_URL}/informativos`, {
//     timeout: 8000,
//   });
//   return handleResponse(res);
// }

// export async function deleteInformativos(id) {
//   const res = await fetch(`${API_URL}/informativos/${id}`, {
//     method: "DELETE",
//   });
//   return handleResponse(res);
// }

// export async function createInformativos(informativo) {
//   const res = await fetch(`${API_URL}/informativos`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(informativo),
//   });
//   return handleResponse(res);
// }

// export async function updateInformativos(id, dadosAtualizados) {
//   const res = await fetch(`${API_URL}/informativos/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dadosAtualizados),
//   });
//   return handleResponse(res);
//}


// ---- Espaços ---- //
export async function getSpaces() {
  const res = await fetchWithTimeout(`${API_URL}/spaces`, { timeout: 8000 });
  return handleResponse(res);
}

export async function deleteSpaces(id) {
  const res = await fetch(`${API_URL}/spaces/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function createSpaces(espaco) {
  const res = await fetch(`${API_URL}/spaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(espaco),
  });
  return handleResponse(res);
}

export async function updateSpaces(id, dadosAtualizados) {
  const res = await fetch(`${API_URL}/spaces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  return handleResponse(res);
}

// ---- Atividades ---- //
// export async function getAtividades() {
//   const res = await fetchWithTimeout(`${API_URL}/atividades`, {
//     timeout: 8000,
//   });
//   return handleResponse(res);
// }

// export async function deleteAtividades(id) {
//   const res = await fetch(`${API_URL}/atividades/${id}`, {
//     method: "DELETE",
//   });
//   return handleResponse(res);
// }

// export async function createAtividades(atividade) {
//   const res = await fetch(`${API_URL}/atividades`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(atividade),
//   });
//   return handleResponse(res);
// }

// export async function updateAtividades(id, dadosAtualizados) {
//   const res = await fetch(`${API_URL}/atividades/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dadosAtualizados),
//   });
//   return handleResponse(res);
// }