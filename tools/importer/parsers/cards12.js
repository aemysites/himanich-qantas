/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a column
  function getImageEl(column) {
    // Find the first <img> in the column
    return column.querySelector('img');
  }

  // Helper to extract the text/link content from a column
  function getTextEl(column) {
    // Find the first link in the .links parbase
    const linksParbase = column.querySelector('.links.parbase');
    if (linksParbase) {
      // Use the entire .links.parbase as the text cell (includes the link)
      return linksParbase;
    }
    // Fallback: just get the first <a>
    const a = column.querySelector('a');
    if (a) return a;
    // Fallback: get all text
    return document.createTextNode(column.textContent.trim());
  }

  // Get all columns (direct children of .row)
  let row = element.querySelector('.row');
  if (!row) {
    // Defensive: maybe columns are direct children
    row = element;
  }
  const columns = Array.from(row.querySelectorAll(':scope > .column'));

  // Build table rows
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  columns.forEach((col) => {
    const img = getImageEl(col);
    const text = getTextEl(col);
    // Only add row if image and text exist
    if (img && text) {
      rows.push([img, text]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
