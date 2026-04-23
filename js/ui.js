

const STATUS_LABELS = {
  watching:      'Viendo',
  completed:     'Completada',
  plan_to_watch: 'Por ver',
  dropped:       'Abandonada',
};

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

// ── Card rendering ─────────────────────────────────────────────────

/**
 * Builds a series card DOM element
 * @param {Object} series
 * @returns {HTMLElement}
 */
function buildCard(series) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = series.id;
  card.dataset.status = series.status;

  const imageContent = series.image_url
    ? `<img src="${escapeHtml(series.image_url)}" alt="${escapeHtml(series.title)}" loading="lazy" onerror="this.parentElement.innerHTML=''" />`
    : '';

  const episodesText = series.episodes > 0
    ? `${series.episodes} ep`
    : '';

  card.innerHTML = `
    <div class="card-image">${imageContent}</div>
    <div class="card-body">
      ${series.genre ? `<p class="card-genre">${escapeHtml(series.genre)}</p>` : ''}
      <h2 class="card-title">${escapeHtml(series.title)}</h2>
      ${series.description ? `<p class="card-description">${escapeHtml(series.description)}</p>` : ''}
      <div class="card-meta">
        <span class="status-badge status-badge--${series.status}">${getStatusLabel(series.status)}</span>
        ${episodesText ? `<span class="card-episodes">${episodesText}</span>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn-edit" data-id="${series.id}">Editar</button>
        <button class="btn-delete" data-id="${series.id}">Eliminar</button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Renders all series into the grid.
 * Handles empty state visibility.
 */
function renderGrid(seriesList, filter = 'all') {
  const grid = document.getElementById('seriesGrid');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');

  loadingState.style.display = 'none';
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? seriesList
    : seriesList.filter(s => s.status === filter);

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach((series, i) => {
    const card = buildCard(series);
    card.style.animationDelay = `${i * 0.04}s`;
    grid.appendChild(card);
  });
}

/** Updates the hero stats counters */
function updateStats(seriesList) {
  document.getElementById('statTotal').textContent = seriesList.length;
  document.getElementById('statWatching').textContent =
    seriesList.filter(s => s.status === 'watching').length;
  document.getElementById('statCompleted').textContent =
    seriesList.filter(s => s.status === 'completed').length;
}

// ── Toast notifications ─────────────────────────────────────────────

/**
 * Shows a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(12px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// ── Modal helpers ──────────────────────────────────────────────────

/** Opens the create/edit modal */
function openModal(series = null) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('seriesForm');

  clearFormErrors();
  form.reset();
  document.getElementById('imagePreview').innerHTML = '';

  if (series) {
    title.textContent = 'Editar serie';
    document.getElementById('seriesId').value = series.id;
    document.getElementById('inputTitle').value = series.title || '';
    document.getElementById('inputGenre').value = series.genre || '';
    document.getElementById('inputStatus').value = series.status || 'plan_to_watch';
    document.getElementById('inputEpisodes').value = series.episodes || '';
    document.getElementById('inputDescription').value = series.description || '';
    document.getElementById('inputImageURL').value = series.image_url || '';
    if (series.image_url) {
      document.getElementById('imagePreview').innerHTML =
        `<img src="${escapeHtml(series.image_url)}" alt="Preview" />`;
    }
  } else {
    title.textContent = 'Nueva serie';
    document.getElementById('seriesId').value = '';
  }

  overlay.classList.add('open');
}

/** Closes the create/edit modal */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/** Clears all field errors in the form */
function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
    .forEach(el => el.style.borderColor = '');
}

/** Shows field-level validation errors from the server */
function showFormErrors(fields) {
  clearFormErrors();
  if (fields) {
    if (fields.title) {
      document.getElementById('errTitle').textContent = fields.title;
      document.getElementById('inputTitle').style.borderColor = 'var(--red)';
    }
    if (fields.episodes) {
      document.getElementById('errEpisodes').textContent = fields.episodes;
      document.getElementById('inputEpisodes').style.borderColor = 'var(--red)';
    }
  }
}

/** Gets form data as a plain object */
function getFormData() {
  return {
    title:       document.getElementById('inputTitle').value.trim(),
    genre:       document.getElementById('inputGenre').value.trim(),
    status:      document.getElementById('inputStatus').value,
    episodes:    parseInt(document.getElementById('inputEpisodes').value) || 0,
    description: document.getElementById('inputDescription').value.trim(),
    image_url:   document.getElementById('inputImageURL').value.trim(),
  };
}

// ── Delete modal ───────────────────────────────────────────────────

function openDeleteModal(id, title) {
  const overlay = document.getElementById('deleteOverlay');
  document.getElementById('deleteSeriesTitle').textContent = `"${title}"`;
  overlay.classList.add('open');
  overlay.dataset.pendingId = id;
}

function closeDeleteModal() {
  document.getElementById('deleteOverlay').classList.remove('open');
}

// ── Utilities ──────────────────────────────────────────────────────

/** Escapes HTML special chars to prevent XSS */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}