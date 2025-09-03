/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first img from a column
  function getImageEl(col) {
    const img = col.querySelector('img');
    return img || '';
  }

  // Helper to extract the heading (h3) from a column
  function getHeadingEl(col) {
    const heading = col.querySelector('h3, h2, h4');
    return heading || '';
  }

  // Helper to extract the description (first p) from a column
  function getDescriptionEl(col) {
    const desc = col.querySelector('.body-text p, p');
    return desc || '';
  }

  // Helper to extract the CTA link from a column
  function getCtaEl(col) {
    const cta = col.querySelector('.links a, a');
    return cta || '';
  }

  // Get all card columns (direct children of .row)
  let columns = [];
  const row = element.querySelector('.row');
  if (row) {
    columns = Array.from(row.children);
  } else {
    columns = Array.from(element.children);
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards']);

  columns.forEach((col) => {
    if (!col.classList.contains('column')) return;

    // Image cell
    const img = getImageEl(col);
    // Text cell: heading, description, CTA
    const textContent = [];
    const heading = getHeadingEl(col);
    if (heading) textContent.push(heading);
    const desc = getDescriptionEl(col);
    if (desc) textContent.push(desc);
    const cta = getCtaEl(col);
    if (cta) textContent.push(cta);
    rows.push([img, textContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
