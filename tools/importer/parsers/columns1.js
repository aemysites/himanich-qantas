/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two columns
  // First column: copyright text
  // Second column: logos (each in its own div)

  // Column 1: copyright
  const col1 = columns[0];

  // Column 2: logos (two links)
  const col2 = columns[1];

  // Compose the cells for the second row
  // Each cell should contain the full column content
  const secondRow = [col1, col2];

  // Table header
  const headerRow = ['Columns (columns1)'];

  // Compose table data
  const cells = [headerRow, secondRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
