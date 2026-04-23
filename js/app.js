// app.js — Orchestrates the app. Connects UI events to API calls.
// This file knows about both ui.js and api.js.

// ── State ──────────────────────────────────────────────────────────
let allSeries = [];   // Full list from the server
let activeFilter = 'all';

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  loadSeries();
});

// ── Event binding ──────────────────────────────────────────────────
function bindEvents() {
  // Open create modal
  document.getElementById('btnOpenModal').addEventListener('click', () => openModal());
  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
  document.getElementById('btnCancelModal').addEventListener('click', closeModal);

  // Close modal on overlay click
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Form submit (create or update)
  document.getElementById('seriesForm').addEventListener('submit', handleFormSubmit);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderGrid(allSeries, activeFilter);
    });
  });

  // Card actions (edit / delete) — event delegation
  document.getElementById('seriesGrid').addEventListener('click', e => {
    const editBtn = e.target.closest('.btn-edit');
    const deleteBtn = e.target.closest('.btn-delete');

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      const series = allSeries.find(s => s.id === id);
      if (series) openModal(series);
    }

    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      const series = allSeries.find(s => s.id === id);
      if (series) openDeleteModal(id, series.title);
    }
  });

  // Delete confirmation
  document.getElementById('btnConfirmDelete').addEventListener('click', handleDelete);
  document.getElementById('btnCancelDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });

  // Image URL preview
  document.getElementById('inputImageURL').addEventListener('input', e => {
    const url = e.target.value.trim();
    const preview = document.getElementById('imagePreview');
    if (url) {
      preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" onerror="this.parentElement.innerHTML=''" />`;
    } else {
      preview.innerHTML = '';
    }
  });
}

// ── Data loading ───────────────────────────────────────────────────

async function loadSeries() {
  document.getElementById('loadingState').style.display = 'block';
  document.getElementById('emptyState').style.display = 'none';

  try {
    const { data, ok } = await getAllSeries();

    if (!ok) {
      showToast('Error al cargar las series', 'error');
      document.getElementById('loadingState').style.display = 'none';
      return;
    }

    allSeries = data || [];
    renderGrid(allSeries, activeFilter);
    updateStats(allSeries);
  } catch (err) {
    document.getElementById('loadingState').style.display = 'none';
    showToast('No se pudo conectar con el servidor. ¿Está corriendo el backend?', 'error');
    console.error('Error loading series:', err);
  }
}

// ── Form submit ────────────────────────────────────────────────────

async function handleFormSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  const id = document.getElementById('seriesId').value;
  const formData = getFormData();
  const submitBtn = document.getElementById('btnSubmit');

  // Client-side title validation
  if (!formData.title) {
    document.getElementById('errTitle').textContent = 'El título es obligatorio';
    document.getElementById('inputTitle').style.borderColor = '#e53935';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando...';

  try {
    let result;

    if (id) {
      // PUT — update existing
      result = await updateSeries(parseInt(id), formData);
    } else {
      // POST — create new (expects 201 Created)
      result = await createSeries(formData);
    }

    if (result.ok) {
      closeModal();

      if (id) {
        // Update in local state
        const idx = allSeries.findIndex(s => s.id === parseInt(id));
        if (idx !== -1) allSeries[idx] = result.data;
        showToast('Serie actualizada ✓', 'success');
      } else {
        // 201 Created — add to top of local state
        allSeries.unshift(result.data);
        showToast('Serie agregada ✓', 'success');
      }

      renderGrid(allSeries, activeFilter);
      updateStats(allSeries);
    } else {
      // Handle validation errors from server (400)
      if (result.data?.fields) {
        showFormErrors(result.data.fields);
        showToast('Corrige los errores del formulario', 'error');
      } else {
        showToast(result.data?.message || 'Error al guardar', 'error');
      }
    }
  } catch (err) {
    showToast('Error de conexión con el servidor', 'error');
    console.error('Submit error:', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar';
  }
}

// ── Delete ─────────────────────────────────────────────────────────

async function handleDelete() {
  const id = parseInt(document.getElementById('deleteOverlay').dataset.pendingId);
  const btn = document.getElementById('btnConfirmDelete');

  btn.disabled = true;
  btn.textContent = 'Eliminando...';

  try {
    const result = await deleteSeries(id);

    if (result.ok) {
      // 204 No Content — success, remove from local state
      allSeries = allSeries.filter(s => s.id !== id);
      closeDeleteModal();
      renderGrid(allSeries, activeFilter);
      updateStats(allSeries);
      showToast('Serie eliminada', 'info');
    } else if (result.status === 404) {
      showToast('La serie ya no existe', 'error');
      closeDeleteModal();
      await loadSeries();
    } else {
      showToast('Error al eliminar la serie', 'error');
    }
  } catch (err) {
    showToast('Error de conexión', 'error');
    console.error('Delete error:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Eliminar';
  }
}
