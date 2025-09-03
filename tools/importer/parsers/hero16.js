/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main container for the hero block
  const container = element.querySelector('.HeroImageAndIntro__container') || element;

  // --- IMAGE ROW ---
  // Find the hero image (picture or img)
  let imageEl = null;
  const heroImageDiv = container.querySelector('.HeroImageAndIntro__heroImage');
  if (heroImageDiv) {
    imageEl = heroImageDiv.querySelector('picture') || heroImageDiv.querySelector('img');
  }

  // --- TEXT ROW ---
  // Find the heading
  let headingEl = null;
  const headingContainer = container.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingContainer) {
    headingEl = headingContainer.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Find the description/paragraph
  let descriptionEl = null;
  const descContainer = container.querySelector('.HeroImageAndIntro__intro-description');
  if (descContainer) {
    // Sometimes the text is wrapped in another div
    descriptionEl = descContainer.querySelector('p') || descContainer;
  }

  // Compose the text cell contents
  const textCellContent = [];
  if (headingEl) textCellContent.push(headingEl);
  if (descriptionEl) textCellContent.push(descriptionEl);

  // --- TABLE ASSEMBLY ---
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
