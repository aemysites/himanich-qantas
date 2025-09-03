/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.classList.contains('block-list')) return;

  // Table header row: one column with block name
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Each card: one cell (text content only, as there are no images/icons)
  const items = element.querySelectorAll(':scope > li');
  items.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    // Only one cell: Use the full link element (includes text and href)
    const cell = [link.cloneNode(true)];
    rows.push(cell);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
