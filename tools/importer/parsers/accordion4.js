/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.classList.contains('frt_accordion')) return;

  // Header row: must be a single cell with 'Accordion'
  const rows = [['Accordion']];

  const items = element.querySelectorAll(':scope > li.accordion-item');

  items.forEach((item) => {
    // Title cell: extract plain text only
    let titleCell = '';
    const headingDiv = item.querySelector('.accordion-item__heading');
    if (headingDiv) {
      const label = headingDiv.querySelector('.accordion-item__button-label');
      if (label) {
        titleCell = label.textContent.trim();
      } else {
        const button = headingDiv.querySelector('button');
        if (button) {
          titleCell = button.textContent.trim();
        }
      }
    }

    // Content cell: everything inside .accordion-item__content
    let contentCell = '';
    const contentDiv = item.querySelector('.accordion-item__content');
    if (contentDiv) {
      if (contentDiv.children.length > 1) {
        contentCell = Array.from(contentDiv.children);
      } else if (contentDiv.children.length === 1) {
        contentCell = contentDiv.children[0];
      } else {
        contentCell = document.createTextNode(contentDiv.textContent.trim());
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the table with a single-cell header row (no colspan)
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = rows[0][0];
  headerTr.appendChild(headerTh);
  thead.appendChild(headerTr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = 1; i < rows.length; i++) {
    const tr = document.createElement('tr');
    rows[i].forEach((cell) => {
      const td = document.createElement('td');
      if (Array.isArray(cell)) {
        cell.forEach((el) => td.appendChild(el));
      } else if (cell instanceof Node) {
        td.appendChild(cell);
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  element.replaceWith(table);
}
