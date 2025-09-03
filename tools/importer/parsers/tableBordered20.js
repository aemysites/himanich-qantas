/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper
  const wrapper = element.querySelector('.comparison-table--wrapper');
  if (!wrapper) return;

  // Table header row as per requirements
  const tableRows = [
    ['Table (bordered)'],
  ];

  // Get all label cells (left column, skip the first empty one)
  const labelCells = Array.from(wrapper.querySelectorAll('.comparison-table--cell.comparison-table--small-hidden'));
  let labelIdx = 0;
  if (labelCells[0] && labelCells[0].textContent.trim() === '') {
    labelIdx = 1;
  }

  // Get all value/data cells (right column)
  const valueCells = Array.from(wrapper.querySelectorAll('.comparison-table--cell[data-cell-id]'));

  // Get the header cell (first value cell)
  let headerCell = '';
  if (valueCells[0]) {
    const headerContent = valueCells[0].querySelector('.body-text');
    headerCell = headerContent ? headerContent.textContent.trim() : valueCells[0].textContent.trim();
  }

  // Insert the header row (first data row: header cell only, no empty column)
  if (headerCell) {
    tableRows.push([headerCell]);
  }

  // Build the rest of the table rows
  for (let i = 1; i < valueCells.length; i++) {
    // Get label cell (left column)
    let labelContent = '';
    if (labelCells[labelIdx + i]) {
      const labelTitle = labelCells[labelIdx + i].querySelector('.comparison-table--row-title');
      if (labelTitle) {
        const ps = labelTitle.querySelectorAll('p');
        if (ps.length > 1 && ps[1].textContent.trim()) {
          // If subtitle exists, append as text with newline
          labelContent = ps[0].textContent.trim() + '\n' + ps[1].textContent.trim();
        } else {
          labelContent = ps[0] ? ps[0].textContent.trim() : '';
        }
      }
    }
    // Get value cell (right column)
    let valueContent = '';
    const bodyText = valueCells[i].querySelector('.body-text');
    if (bodyText) {
      valueContent = bodyText.textContent.trim();
    } else {
      valueContent = valueCells[i].textContent.trim();
    }
    // Only push the row if label is not empty (prevents empty column)
    if (labelContent && labelContent.trim() !== '') {
      tableRows.push([
        labelContent,
        valueContent,
      ]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
