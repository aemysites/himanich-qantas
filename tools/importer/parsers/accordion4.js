/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.classList.contains('frt_accordion')) return;

  // Table header row as per example
  const headerRow = ['Accordion'];
  const rows = [headerRow];

  // Get all accordion items
  const items = element.querySelectorAll(':scope > li.accordion-item');

  items.forEach((item) => {
    // Title cell: extract plain text only (no <h4> etc)
    let titleText = '';
    const labelEl = item.querySelector('.accordion-item__button-label');
    if (labelEl) {
      titleText = labelEl.textContent.trim();
    } else {
      // fallback: button text
      const btn = item.querySelector('.accordion-item__button');
      if (btn) {
        titleText = btn.textContent.trim();
      }
    }

    // Content cell: all children of .accordion-item__content
    const contentEl = item.querySelector('.accordion-item__content');
    let contentCell;
    if (contentEl) {
      const children = Array.from(contentEl.childNodes).filter((node) => {
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else {
        contentCell = children;
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
