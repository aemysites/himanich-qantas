/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the hero image container
  const heroImageContainer = element.querySelector('.HeroImageAndIntro__heroImage');
  let imageContent = null;
  if (heroImageContainer) {
    // Use the whole picture block if present, else fallback to img
    const picture = heroImageContainer.querySelector('picture');
    if (picture) {
      imageContent = picture;
    } else {
      const img = heroImageContainer.querySelector('img');
      if (img) imageContent = img;
    }
  }

  // Defensive: Find the intro container
  const introContainer = element.querySelector('.HeroImageAndIntro__intro');
  let textContent = [];
  if (introContainer) {
    // Heading
    const heading = introContainer.querySelector('.HeroImageAndIntro__intro-heading h1');
    if (heading) textContent.push(heading);

    // Description (paragraph)
    const description = introContainer.querySelector('.HeroImageAndIntro__intro-description p');
    if (description) textContent.push(description);
  }

  // Table header row
  const headerRow = ['Hero (hero6)'];

  // Table image row
  const imageRow = [imageContent ? imageContent : ''];

  // Table content row (title, description)
  const contentRow = [textContent.length ? textContent : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
