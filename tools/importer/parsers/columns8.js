/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header
  const headerRow = ['Columns (columns8)'];

  // Defensive: find the nav > ul containing the anchor links
  const nav = element.querySelector('nav');
  const ul = nav ? nav.querySelector('ul') : null;
  if (!ul) return;

  // Get all list items (anchor links)
  const links = Array.from(ul.querySelectorAll('li'));

  // Split the links into two columns as visually shown
  // There are 16 items, so 8 per column
  const colCount = 2;
  const itemsPerCol = Math.ceil(links.length / colCount);
  const columns = [[], []];
  links.forEach((li, i) => {
    const colIdx = Math.floor(i / itemsPerCol);
    columns[colIdx].push(li);
  });

  // For each column, create a <ul> and append the <li> elements
  const columnEls = columns.map((colItems) => {
    const ulCol = document.createElement('ul');
    colItems.forEach((li) => {
      ulCol.appendChild(li);
    });
    return ulCol;
  });

  // Second row: two columns, each with a <ul> of links
  const secondRow = [...columnEls];

  // Build the table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
