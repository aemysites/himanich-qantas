/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate column children
  const columns = Array.from(row.children).filter(col => col.classList.contains('column'));
  if (columns.length < 2) return;

  // First column: left content (text)
  const leftCol = columns[0];
  // Find the main body content
  const body = leftCol.querySelector('.body-text') || leftCol;

  // Second column: right content (image)
  const rightCol = columns[1];
  // Find the image (could be nested)
  let imageEl = rightCol.querySelector('img');
  // Defensive: if no image, use the whole rightCol
  const rightContent = imageEl ? imageEl : rightCol;

  // Table header row
  const headerRow = ['Columns (columns12)'];
  // Table content row: left and right columns
  const contentRow = [body, rightContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
