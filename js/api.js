// api.js — All communication with the backend REST API
// This module knows nothing about HTML. It only deals with data.

const API_BASE = window.APP_CONFIG?.API_BASE_URL || "https://web-production-42b2c.up.railway.app" ;

/**
 * Generic fetch wrapper that handles JSON parsing and error responses
 * @param {string} path - API path (e.g. '/series')
 * @param {RequestInit} options - fetch options
 * @returns {Promise<{data: any, status: number, ok: boolean}>}
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // 204 No Content — no body to parse
  if (response.status === 204) {
    return { data: null, status: 204, ok: true };
  }

  const data = await response.json();
  return { data, status: response.status, ok: response.ok };
}

// ── Public API functions ──────────────────────────────────────────

/** GET /series — returns array of series */
async function getAllSeries() {
  return request('/series');
}

/** GET /series/:id — returns a single series */
async function getSeriesById(id) {
  return request(`/series/${id}`);
}

/**
 * POST /series — creates a new series
 * On success: 201 Created with the new series object
 * On error: 400 with validation details
 */
async function createSeries(seriesData) {
  return request('/series', {
    method: 'POST',
    body: JSON.stringify(seriesData),
  });
}

/**
 * PUT /series/:id — updates an existing series
 * On success: 200 OK with updated series object
 * On error: 400 (validation) or 404 (not found)
 */
async function updateSeries(id, seriesData) {
  return request(`/series/${id}`, {
    method: 'PUT',
    body: JSON.stringify(seriesData),
  });
}

/**
 * DELETE /series/:id — deletes a series
 * On success: 204 No Content
 * On error: 404 if not found
 */
async function deleteSeries(id) {
  return request(`/series/${id}`, { method: 'DELETE' });
}
