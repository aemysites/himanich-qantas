/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.matches('ul.block-list')) return;

  // Get all <li> children (columns)
  const columns = Array.from(element.children).filter(li => li.matches('li'));

  // Each cell should contain the content of the <li>, not the <li> itself
  const contentRow = columns.map(li => {
    // Use all child nodes of <li> (e.g., <a>)
    const cell = document.createElement('div');
    Array.from(li.childNodes).forEach(node => cell.appendChild(node.cloneNode(true)));
    return cell;
  });

  // Table header as per requirements
  const headerRow = ['Columns (columns1)'];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
