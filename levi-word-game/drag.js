/**
 * Drag-and-drop system for word tiles.
 *
 * Usage:
 *   initDrag(wordBankEl, dropZoneEl)  — set up drag for current round
 *   getDropZoneWords()                — returns ordered array of word strings in drop zone
 *   cleanupDrag()                     — remove all listeners
 */

let _wordBank = null;
let _dropZone = null;
let _dragTile = null;
let _placeholder = null;
let _startX = 0;
let _startY = 0;
let _isDragging = false;
const TAP_THRESHOLD = 10;

function initDrag(wordBankEl, dropZoneEl) {
  _wordBank = wordBankEl;
  _dropZone = dropZoneEl;
  _wordBank.addEventListener("pointerdown", onPointerDown);
  _dropZone.addEventListener("pointerdown", onPointerDown);
}

function cleanupDrag() {
  if (_wordBank) _wordBank.removeEventListener("pointerdown", onPointerDown);
  if (_dropZone) _dropZone.removeEventListener("pointerdown", onPointerDown);
  _dragTile = null;
  _placeholder = null;
}

function getDropZoneWords() {
  if (!_dropZone) return [];
  return Array.from(_dropZone.querySelectorAll(".word-tile"))
    .map(tile => tile.textContent);
}

function onPointerDown(e) {
  const tile = e.target.closest(".word-tile");
  if (!tile) return;

  e.preventDefault();
  tile.setPointerCapture(e.pointerId);
  _dragTile = tile;
  _startX = e.clientX;
  _startY = e.clientY;
  _isDragging = false;
  _dragTile.classList.add("dragging");

  // Create placeholder
  _placeholder = document.createElement("div");
  _placeholder.className = "word-tile";
  _placeholder.style.visibility = "hidden";
  _placeholder.textContent = tile.textContent;

  const onMove = (e2) => {
    if (!_dragTile) return;
    if (!_isDragging) {
      const dx = e2.clientX - _startX;
      const dy = e2.clientY - _startY;
      if (Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD) return;
      _isDragging = true;
    }
    // Move tile with pointer using fixed positioning
    _dragTile.style.position = "fixed";
    _dragTile.style.zIndex = "1000";
    _dragTile.style.left = (e2.clientX - _dragTile.offsetWidth / 2) + "px";
    _dragTile.style.top = (e2.clientY - _dragTile.offsetHeight / 2) + "px";

    // Determine which container the pointer is over
    const overDropZone = isOverElement(e2.clientX, e2.clientY, _dropZone);
    const targetContainer = overDropZone ? _dropZone : _wordBank;

    // Insert placeholder at nearest position
    if (_placeholder.parentNode !== targetContainer) {
      _placeholder.remove();
      // Hide the "Drag words here" hint when dropping into drop zone
      const hint = _dropZone.querySelector(".drop-hint");
      if (hint && overDropZone) hint.style.display = "none";
    }
    const nearest = getNearestTile(targetContainer, e2.clientX, e2.clientY);
    if (nearest) {
      targetContainer.insertBefore(_placeholder, nearest);
    } else {
      targetContainer.appendChild(_placeholder);
    }
  };

  const onUp = () => {
    if (!_dragTile) return;
    _dragTile.classList.remove("dragging");
    _dragTile.style.position = "";
    _dragTile.style.zIndex = "";
    _dragTile.style.left = "";
    _dragTile.style.top = "";

    if (!_isDragging) {
      // Tap: toggle tile between word bank and drop zone
      _placeholder.remove();
      const inWordBank = _dragTile.parentNode === _wordBank;
      if (inWordBank) {
        _dropZone.appendChild(_dragTile);
        const hint = _dropZone.querySelector(".drop-hint");
        if (hint) hint.style.display = "none";
      } else {
        _wordBank.appendChild(_dragTile);
        const hint = _dropZone.querySelector(".drop-hint");
        if (hint && _dropZone.querySelectorAll(".word-tile").length === 0) {
          hint.style.display = "";
        }
      }
    } else {
      // Drag: place tile where placeholder is
      if (_placeholder.parentNode) {
        _placeholder.parentNode.insertBefore(_dragTile, _placeholder);
      }
      _placeholder.remove();

      // Show hint again if drop zone is empty
      const hint = _dropZone.querySelector(".drop-hint");
      if (hint && _dropZone.querySelectorAll(".word-tile").length === 0) {
        hint.style.display = "";
      }
    }

    _dragTile.removeEventListener("pointermove", onMove);
    _dragTile.removeEventListener("pointerup", onUp);
    _dragTile.removeEventListener("pointercancel", onUp);
    _dragTile = null;
  };

  tile.addEventListener("pointermove", onMove);
  tile.addEventListener("pointerup", onUp);
  tile.addEventListener("pointercancel", onUp);
}

function isOverElement(x, y, el) {
  const rect = el.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function getNearestTile(container, x, y) {
  const tiles = Array.from(container.querySelectorAll(".word-tile:not(.dragging)"));
  let closest = null;
  let closestDist = Infinity;

  for (const tile of tiles) {
    if (tile === _placeholder) continue;
    const rect = tile.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(x - centerX) + Math.abs(y - centerY);
    // Insert before this tile if pointer is to its left or above
    if (dist < closestDist && (x < centerX || y < rect.top)) {
      closest = tile;
      closestDist = dist;
    }
  }
  return closest;
}
