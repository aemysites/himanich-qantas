/* global WebImporter */
export default function parse(element, { document }) {
  // Table block header row as per example markdown
  const headerRow = ['Table (striped & bordered)'];

  // Find the main table wrapper
  const tableWrapper = element.querySelector('.comparison-table--wrapper');
  if (!tableWrapper) return;

  // Find all cell elements with data-cell-id
  const allCells = Array.from(tableWrapper.querySelectorAll('.comparison-table--cell[data-cell-id]'));

  // Determine number of columns and rows
  let maxCol = 0, maxRow = 0;
  const cellMap = {};
  allCells.forEach(cell => {
    const id = cell.getAttribute('data-cell-id');
    if (!id) return;
    const [rowStr, colStr] = id.replace('cell-', '').split('-');
    const row = parseInt(rowStr, 10);
    const col = parseInt(colStr, 10);
    if (row > maxRow) maxRow = row;
    if (col > maxCol) maxCol = col;
    if (!cellMap[row]) cellMap[row] = {};
    cellMap[row][col] = cell;
  });

  // The first row (row=1) are the product names (column headers)
  const productNames = [];
  for (let col = 1; col <= maxCol; col++) {
    const cell = cellMap[1][col];
    let content = '';
    if (cell) {
      const bodyText = cell.querySelector('.body-text');
      if (bodyText) {
        const p = bodyText.querySelector('p');
        if (p) {
          content = p.cloneNode(true);
        } else {
          content = bodyText.textContent.trim();
        }
      }
    }
    productNames.push(content);
  }

  // Build the table rows
  const tableRows = [];
  tableRows.push(headerRow);

  // For each data row (row=2..maxRow)
  for (let row = 2; row <= maxRow; row++) {
    const rowArr = [];
    // Row header: get .comparison-table--row-title from any cell in this row
    let headerCell = '';
    for (let col = 1; col <= maxCol; col++) {
      const cell = cellMap[row][col];
      if (!cell) continue;
      const rowTitle = cell.querySelector('.comparison-table--row-title');
      if (rowTitle) {
        const ps = Array.from(rowTitle.querySelectorAll('p'));
        if (ps.length) {
          headerCell = ps.map(p => p.cloneNode(true));
        } else {
          headerCell = rowTitle.textContent.trim();
        }
        break;
      }
    }
    if (!headerCell) headerCell = '';
    rowArr.push(headerCell);
    for (let col = 1; col <= maxCol; col++) {
      let content = '';
      if (row === 2) {
        // For the first data row, use the product names as the data
        content = productNames[col - 1];
      } else {
        const cell = cellMap[row][col];
        if (cell) {
          const bodyText = cell.querySelector('.body-text');
          if (bodyText) {
            const p = bodyText.querySelector('p');
            if (p) {
              content = p.cloneNode(true);
            } else {
              content = bodyText.textContent.trim();
            }
          }
        }
      }
      rowArr.push(content);
    }
    tableRows.push(rowArr);
  }

  // Create the table block
  const tableBlock = WebImporter.DOMUtils.createTable(tableRows, document);

  // Fix: set colspan on the header row so it spans all columns
  const table = tableBlock;
  if (table && table.rows && table.rows.length > 0) {
    const headerTr = table.rows[0];
    if (headerTr.cells.length === 1 && table.rows[1]) {
      headerTr.cells[0].setAttribute('colspan', table.rows[1].cells.length);
    }
  }

  // Replace the original element with the new table
  element.replaceWith(tableBlock);
}
