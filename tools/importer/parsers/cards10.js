/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find all immediate card columns
  const columns = element.querySelectorAll(':scope .column');

  columns.forEach((col) => {
    // --- IMAGE ---
    let imgEl = null;
    const picture = col.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    if (!imgEl) {
      imgEl = col.querySelector('img');
    }

    // --- TEXT CONTENT ---
    // Find the card title (link text)
    let titleText = '';
    let titleHref = '';
    const link = col.querySelector('.links a');
    if (link) {
      titleText = link.textContent.trim();
      titleHref = link.getAttribute('href');
    }

    // Find description/body text (include all text from .body-text, even if whitespace)
    let descText = '';
    const bodyText = col.querySelector('.body-text');
    if (bodyText) {
      // Only get text if node exists and is not null
      descText = (bodyText.innerText || '').replace(/\s+/g, ' ').trim();
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleText) {
      // Title as strong
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      textCellContent.push(strong);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCellContent.push(p);
    }
    // Always include CTA as link at the bottom
    if (titleText && titleHref) {
      const a = document.createElement('a');
      a.href = titleHref;
      a.textContent = titleText;
      textCellContent.push(a);
    }

    // Defensive: if no text content, add a placeholder
    if (textCellContent.length === 0 && titleText) {
      textCellContent.push(document.createTextNode(titleText));
    }

    // Compose the row: [image, text content]
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
