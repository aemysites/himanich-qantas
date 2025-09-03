/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Hero'];

  // No background image in the provided HTML
  const imageRow = [''];

  // The content row should contain all text content from the HTML
  // In this case, the only content is the .column div (which contains .text-center and h2)
  // We'll extract the .column div itself for the content cell
  const column = element.querySelector('.column');
  let contentCell = '';
  if (column) {
    contentCell = column;
  }

  const contentRow = [contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
