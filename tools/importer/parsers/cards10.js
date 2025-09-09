/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row (exactly one column)
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find all columns in the row
  const row = element.querySelector('.row');
  const columns = row ? row.querySelectorAll(':scope > .column') : [];

  columns.forEach((col) => {
    // First cell: image (mandatory)
    const img = col.querySelector('.responsive-image img');
    // Second cell: text content (mandatory)
    const textContent = [];
    // Title (the .links a)
    const titleLink = col.querySelector('.links a');
    if (titleLink) textContent.push(titleLink);
    // Description (the .body-text, only if not empty)
    const desc = col.querySelector('.body-text');
    if (desc) {
      const p = desc.querySelector('p');
      if (!p || p.textContent.replace(/\s|\u00a0/g, '').length > 0) {
        textContent.push(desc);
      }
    }
    rows.push([
      img || '',
      textContent.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
