/* global WebImporter */
export default function parse(element, { document }) {
  // Always use block name as header row
  const headerRow = ['Table (libraryMetadata17)'];

  // Get column headers (weight categories)
  const colHeaderCells = [
    element.querySelector('.comparison-table--cell[data-cell-id="cell-1-1"]'),
    element.querySelector('.comparison-table--cell[data-cell-id="cell-1-2"]')
  ];
  const colHeaders = colHeaderCells.map(cell => {
    const bodyText = cell && cell.querySelector('.body-text');
    return bodyText ? bodyText.cloneNode(true) : document.createTextNode('');
  });

  // Get row labels (left column)
  const rowLabels = [];
  for (let i = 2; i <= 4; i++) {
    // Find the .comparison-table--row-title for each row (order:2,3,4)
    const stripedCell = Array.from(element.querySelectorAll(`.comparison-table--cell[style*="order:${i};"]`)).find(cell => cell.classList.contains('comparison-table--cell-striped'));
    if (stripedCell) {
      const rowTitle = stripedCell.querySelector('.comparison-table--row-title');
      rowLabels.push(rowTitle ? rowTitle.cloneNode(true) : document.createTextNode(''));
    } else {
      rowLabels.push(document.createTextNode(''));
    }
  }

  // For each row, get the two data cells
  function getRowData(rowNum) {
    const leftCell = element.querySelector(`.comparison-table--cell[data-cell-id="cell-${rowNum}-1"]`);
    const rightCell = element.querySelector(`.comparison-table--cell[data-cell-id="cell-${rowNum}-2"]`);
    const leftContent = leftCell ? (leftCell.querySelector('.body-text') ? leftCell.querySelector('.body-text').cloneNode(true) : document.createTextNode('')) : document.createTextNode('');
    const rightContent = rightCell ? (rightCell.querySelector('.body-text') ? rightCell.querySelector('.body-text').cloneNode(true) : document.createTextNode('')) : document.createTextNode('');
    return [leftContent, rightContent];
  }

  // Compose table rows: header row, then all rows have 3 columns (label, col1, col2)
  const tableCells = [
    headerRow,
    [rowLabels[0], ...getRowData(2)],
    [rowLabels[1], ...getRowData(3)],
    [rowLabels[2], ...getRowData(4)]
  ];

  // Insert the column headers as the first data row (after header row), but without unnecessary empty column
  tableCells.splice(1, 0, [rowLabels[0], colHeaders[0], colHeaders[1]]);

  // Remove the duplicate label from the first data row
  tableCells.splice(2, 1);

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
