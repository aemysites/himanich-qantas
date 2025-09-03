/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate column children
  const columns = Array.from(element.querySelectorAll(':scope .row.icon-text-column-wrapper > .column'));

  // For each column, gather its content block (reference the actual DOM node)
  const columnCells = columns.map((col) => {
    // The column content is the inner div of .column
    // Defensive: find the first child div
    const innerDiv = col.querySelector(':scope > div');
    // If not found, fallback to the column itself
    return innerDiv || col;
  });

  // Table header row: must match the block name exactly
  const headerRow = ['Columns (columns2)'];

  // Table content row: one cell per column, referencing the DOM nodes
  const contentRow = columnCells;

  // Compose table data
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
