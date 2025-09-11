/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is a UL with accordion items
  if (!element || !element.classList.contains('frt_accordion')) return;

  // Prepare the header row for the Accordion block
  const headerRow = ['Accordion'];
  const rows = [headerRow];

  // Get all accordion items (LI elements)
  const items = element.querySelectorAll(':scope > li.accordion-item');

  items.forEach((item) => {
    // Title cell: find the heading label (h4 inside button)
    let titleCell = '';
    const headingDiv = item.querySelector('.accordion-item__heading');
    if (headingDiv) {
      const button = headingDiv.querySelector('.accordion-item__button');
      if (button) {
        const label = button.querySelector('.accordion-item__button-label');
        if (label) {
          titleCell = label.textContent.trim();
        }
      }
    }

    // Content cell: get the content div
    let contentCell = '';
    const contentDiv = item.querySelector('.accordion-item__content');
    if (contentDiv) {
      // Defensive: if there are multiple elements, group them in a fragment
      if (contentDiv.children.length > 1) {
        const frag = document.createDocumentFragment();
        Array.from(contentDiv.children).forEach((child) => {
          frag.appendChild(child);
        });
        contentCell = frag;
      } else if (contentDiv.children.length === 1) {
        contentCell = contentDiv.children[0];
      } else {
        contentCell = contentDiv.textContent.trim();
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the Accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
