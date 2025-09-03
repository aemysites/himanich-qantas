/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all anchor links as two columns
  function getColumnsFromNav(nav) {
    const ul = nav.querySelector('ul');
    if (!ul) return [];
    const items = Array.from(ul.children).filter(li => li.tagName === 'LI');
    // Split into two roughly equal columns
    const mid = Math.ceil(items.length / 2);
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    const ul1 = document.createElement('ul');
    const ul2 = document.createElement('ul');
    col1.appendChild(ul1);
    col2.appendChild(ul2);
    items.forEach((li, i) => {
      // Use the original LI element from the DOM
      if (i < mid) {
        ul1.appendChild(li);
      } else {
        ul2.appendChild(li);
      }
    });
    return [col1, col2];
  }

  // Defensive: find the nav element containing the anchor links
  let nav = element.querySelector('nav');
  if (!nav) {
    // Try to find nav deeper
    nav = element.querySelector('ul')?.closest('nav');
  }
  if (!nav) {
    // If still not found, abort
    return;
  }

  // Get columns
  const columns = getColumnsFromNav(nav);
  if (columns.length === 0) return;

  // Build table rows
  const headerRow = ['Columns (columns27)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
