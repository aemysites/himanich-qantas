/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main table wrapper
  const tableWrapper = element.querySelector('.comparison-table--wrapper');
  if (!tableWrapper) return;

  // Find all header cells (column headers)
  const headerCells = Array.from(tableWrapper.querySelectorAll('.comparison-table--cell'))
    .filter(cell => !cell.hasAttribute('data-cell-id'));

  // Find all data cells (with data-cell-id)
  const dataCells = Array.from(tableWrapper.querySelectorAll('.comparison-table--cell[data-cell-id]'));

  // Determine number of columns by counting header cells
  const numCols = headerCells.length;
  if (numCols === 0) return;

  // Block header row (must match example exactly)
  const headerRow = ['Table (striped & bordered)'];

  // Build the column header row: get product/service names from the first row of dataCells
  const colHeaderRow = [];
  for (let col = 0; col < numCols; col++) {
    const cell = dataCells[col];
    let text = '';
    if (cell) {
      const bodyText = cell.querySelector('.body-text');
      if (bodyText) {
        text = bodyText.textContent.trim();
      } else {
        text = cell.textContent.trim();
      }
    }
    colHeaderRow.push(text);
  }

  // For each row, get the row label from headerCells[0] .comparison-table--row-title and the data from the corresponding dataCells
  const numRows = dataCells.length / numCols;
  const tableRows = [];
  for (let row = 0; row < numRows; row++) {
    // Get row label from the .comparison-table--row-title in headerCells[0]
    let rowLabel = '';
    const rowTitleDiv = headerCells[0].querySelectorAll('.comparison-table--row-title')[row];
    if (rowTitleDiv) {
      let label = '';
      Array.from(rowTitleDiv.children).forEach((child, idx) => {
        if (child.textContent.trim()) {
          label += child.textContent.trim();
          if (idx === 0 && rowTitleDiv.children.length > 1) label += '\n';
        }
      });
      rowLabel = label;
    }
    const rowCells = [rowLabel];
    for (let col = 0; col < numCols; col++) {
      const idx = row * numCols + col;
      const cell = dataCells[idx];
      let content = '';
      if (cell) {
        const bodyText = cell.querySelector('.body-text');
        if (bodyText) {
          if (bodyText.childNodes.length === 1 && bodyText.childNodes[0].nodeType === Node.ELEMENT_NODE) {
            content = bodyText.childNodes[0].cloneNode(true);
          } else {
            const div = document.createElement('div');
            bodyText.childNodes.forEach(n => div.appendChild(n.cloneNode(true)));
            content = div;
          }
        } else {
          if (cell.childNodes.length === 1 && cell.childNodes[0].nodeType === Node.ELEMENT_NODE) {
            content = cell.childNodes[0].cloneNode(true);
          } else {
            const div = document.createElement('div');
            cell.childNodes.forEach(n => div.appendChild(n.cloneNode(true)));
            content = div;
          }
        }
      }
      rowCells.push(content);
    }
    tableRows.push(rowCells);
  }

  // Compose the final cells array: header row must be single cell only, then col headers, then data
  const cells = [];
  cells.push(headerRow);
  cells.push(['', ...colHeaderRow]); // first cell empty for row labels, then column headers
  tableRows.forEach(row => cells.push(row));

  // Fix: ensure header row is a single cell only
  if (cells[0].length > 1) {
    cells[0] = [cells[0][0]];
  }

  // Remove unnecessary empty columns from data rows (if any)
  for (let i = 2; i < cells.length; i++) {
    if (cells[i][0] === '') {
      cells[i].shift();
    }
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
