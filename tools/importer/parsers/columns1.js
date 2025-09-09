/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > .column'));

  // If columns not found, fallback to all direct children
  const cells = columns.length > 0 ? columns : Array.from(element.children);

  // Table header row
  const headerRow = ['Columns (columns1)'];

  // Second row: each cell is a column's content
  const contentRow = cells.map((col) => col);

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
