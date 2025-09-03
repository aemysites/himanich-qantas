/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row (CRITICAL: must match example exactly)
  const headerRow = ['Table (striped & bordered)'];

  // Find the wrapper
  const wrapper = element.querySelector('.comparison-table--wrapper');
  if (!wrapper) return;

  // Find all cells in order
  const allCells = Array.from(wrapper.querySelectorAll(':scope > .comparison-table--cell'));

  // Determine number of columns (products)
  // Product name cells have data-cell-id="cell-1-X"
  const productNameCells = allCells.filter(cell => cell.getAttribute('data-cell-id') && cell.getAttribute('data-cell-id').startsWith('cell-1-'));
  const numProducts = productNameCells.length;

  // Get product names row (second row in markdown)
  // Each product name cell contains a <b> inside an <a>
  const productNamesRow = productNameCells.map(cell => {
    const link = cell.querySelector('a');
    if (link) {
      return link.cloneNode(true);
    }
    return cell.textContent.trim();
  });

  // Get feature names and their subtitles (left column)
  // These are in .comparison-table--row-title inside .comparison-table--cell.comparison-table--small-hidden
  const featureNameCells = Array.from(wrapper.querySelectorAll('.comparison-table--cell.comparison-table--small-hidden .comparison-table--row-title'));
  // Each feature row: [feature name + subtitle, ...values]
  const featureRows = [];
  for (let i = 0; i < featureNameCells.length; i++) {
    const featureCell = featureNameCells[i];
    // Compose feature name and subtitle
    const ps = featureCell.querySelectorAll('p');
    let featureLabel = '';
    if (ps.length === 2) {
      featureLabel = ps[0].textContent.trim() + '\n' + ps[1].textContent.trim();
    } else {
      featureLabel = featureCell.textContent.trim();
    }
    const row = [featureLabel];
    // For each product, get the value cell for this feature
    for (let j = 1; j <= numProducts; j++) {
      // feature rows start from data-cell-id="cell-(i+2)-(j)"
      const valueCell = wrapper.querySelector(`[data-cell-id="cell-${i+2}-${j}"]`);
      let value = '';
      if (valueCell) {
        // FIX: Get full block content, not just <p>
        const bodyText = valueCell.querySelector('.body-text');
        if (bodyText) {
          // Use all child nodes of bodyText
          const nodes = Array.from(bodyText.childNodes);
          if (nodes.length > 0) {
            value = nodes.map(n => n.cloneNode(true));
          } else {
            value = bodyText.textContent.trim();
          }
        } else {
          value = valueCell.textContent.trim();
        }
      }
      row.push(value);
    }
    featureRows.push(row);
  }

  // Compose all rows
  // The first row is the header row (single column)
  // The second row is the product names row (no empty cell at start)
  // The rest are feature rows (first cell is feature name, then values)
  const tableRows = [headerRow, ['Product Name', ...productNamesRow], ...featureRows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
