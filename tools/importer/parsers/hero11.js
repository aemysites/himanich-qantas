/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main container for hero content
  const container = element;

  // Header row for block table
  const headerRow = ['Hero (hero11)'];

  // --- Row 2: Image ---
  // Find the hero image container
  let imageCell = '';
  const heroImageDiv = Array.from(container.querySelectorAll(':scope > div'))
    .find(div => div.classList.contains('HeroImageAndIntro__container'));
  if (heroImageDiv) {
    const imageDiv = Array.from(heroImageDiv.querySelectorAll(':scope > div'))
      .find(div => div.classList.contains('HeroImageAndIntro__heroImage'));
    if (imageDiv) {
      // Find <img> inside <picture>
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }

  // --- Row 3: Text Content ---
  let textCellContent = [];
  if (heroImageDiv) {
    const introDiv = Array.from(heroImageDiv.querySelectorAll(':scope > div'))
      .find(div => div.classList.contains('HeroImageAndIntro__intro'));
    if (introDiv) {
      // Heading
      const headingContainer = introDiv.querySelector('.HeroImageAndIntro__intro-heading');
      if (headingContainer) {
        const h1 = headingContainer.querySelector('h1');
        if (h1) textCellContent.push(h1);
      }
      // Description (paragraph)
      const descContainer = introDiv.querySelector('.HeroImageAndIntro__intro-description');
      if (descContainer) {
        const textDiv = descContainer.querySelector('.HeroImageAndIntro__text');
        if (textDiv) {
          const p = textDiv.querySelector('p');
          if (p) textCellContent.push(p);
        }
      }
    }
  }

  // Defensive: ensure at least something is present
  if (!imageCell) imageCell = '';
  if (textCellContent.length === 0) textCellContent = [''];

  // Compose table rows
  const cells = [
    headerRow,
    [imageCell],
    [textCellContent],
  ];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
