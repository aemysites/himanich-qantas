/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Defensive: Only proceed if both columns exist
  if (!leftCol || !rightCol) return;

  // The left column contains the copyright paragraph
  // The right column contains the logo links

  // Table header row: must match block name exactly
  const headerRow = ['Columns (columns21)'];

  // Table content row: reference the actual DOM elements
  const contentRow = [leftCol, rightCol];

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
