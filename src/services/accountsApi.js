/* global fetch */

const API_URL = 'http://localhost:3333';

export async function createAccount(data) {
  const response = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Erro ao criar conta');
  }

  return response.json();
}
