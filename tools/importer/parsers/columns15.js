/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns block (columns15)'];

  // Defensive: find the columns inside the block
  // The structure is: .full-width > .row > .column > .icon-text-column-6-6 > .row > .column.medium-6
  // We want the two .column.medium-6 elements inside the inner .row
  let columns = [];
  // Find the deepest .row containing the actual columns
  const innerRows = element.querySelectorAll('.row');
  let contentRow = null;
  for (const row of innerRows) {
    // Look for .column.medium-6 children
    const colChildren = row.querySelectorAll(':scope > .column.medium-6');
    if (colChildren.length > 0) {
      contentRow = row;
      break;
    }
  }
  if (contentRow) {
    columns = Array.from(contentRow.querySelectorAll(':scope > .column.medium-6'));
  }

  // Defensive fallback: if not found, try to get all .column.medium-6 anywhere inside
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.column.medium-6'));
  }

  // Each column cell should contain the full content of that column
  // This ensures resilience to minor HTML variations
  const contentRowCells = columns.map((col) => col);

  // Compose the table rows
  const rows = [headerRow, contentRowCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
