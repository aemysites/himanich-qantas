/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main wrapper
  const wrapper = element.querySelector('.comparison-table--wrapper');
  if (!wrapper) return;

  // Table header row (block name, as per markdown example)
  const headerRow = ['Table (striped & bordered)']; // match example exactly

  // Get all cells in order
  const allCells = Array.from(wrapper.querySelectorAll('.comparison-table--cell'));

  // Get all row header cells (skip the first, which is empty)
  const rowHeaderCells = allCells.filter(cell =>
    cell.classList.contains('comparison-table--small-hidden') &&
    !cell.hasAttribute('data-cell-id') &&
    cell.querySelector('.comparison-table--row-title')
  );

  // Get all data cells (with data-cell-id)
  const dataCells = allCells.filter(cell => cell.hasAttribute('data-cell-id'));

  // The first data cell is the column header (e.g., "Airbus A321XLR")
  // We'll build the first row after the block header as [<column header>]
  const columnHeaderCell = dataCells[0];
  let columnHeaderContent = '';
  if (columnHeaderCell) {
    // Find the bolded name inside the cell
    const bold = columnHeaderCell.querySelector('b');
    columnHeaderContent = bold ? bold.textContent.trim() : columnHeaderCell.textContent.trim();
    // If no bold, get all text from .body-text p
    if (!bold) {
      const p = columnHeaderCell.querySelector('.body-text p');
      if (p) columnHeaderContent = p.textContent.trim();
    }
  }

  // Build table rows
  const rows = [];
  // First row: only the column header (no empty cell)
  rows.push([columnHeaderContent]);

  // Now, for each row header, pair with the corresponding data cell
  for (let i = 0; i < rowHeaderCells.length; i++) {
    const headerCell = rowHeaderCells[i];
    const dataCell = dataCells[i + 1]; // +1 because first data cell is the column header
    // Get the label (including subtitle if present)
    const rowTitleDiv = headerCell.querySelector('.comparison-table--row-title');
    let label = '';
    if (rowTitleDiv) {
      // Compose label and subtitle (if any)
      const ps = rowTitleDiv.querySelectorAll('p');
      if (ps.length > 0) {
        label = ps[0].textContent.trim();
        if (ps.length > 1 && ps[1].textContent.trim()) {
          // Subtitle in parentheses, as in the screenshot
          label += `\n${ps[1].textContent.trim()}`;
        }
      }
    }
    // For the value, get the main text content (centered)
    let value = '';
    if (dataCell) {
      // Find the .body-text p
      const p = dataCell.querySelector('.body-text p');
      value = p ? p.textContent.trim() : dataCell.textContent.trim();
      // If .body-text p is missing, get all textContent
      if (!p) {
        value = dataCell.textContent.trim();
      }
    }
    rows.push([label, value]);
  }

  // Build the table array
  const tableArray = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);

  // Replace the original element
  element.replaceWith(block);
}
