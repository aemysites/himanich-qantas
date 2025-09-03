/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Header row as specified
  const headerRow = ['Columns (columns6)'];

  // Get immediate children columns
  const columns = element.querySelectorAll(':scope > div.column');

  // Defensive: if no columns found, fallback to all children
  const colArr = columns.length ? Array.from(columns) : Array.from(element.children);

  // Each column's content will be a cell
  const contentRow = colArr.map(col => col);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
