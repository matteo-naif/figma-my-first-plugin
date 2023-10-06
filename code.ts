figma.showUI(__html__);

figma.ui.resize(500, 500);

type PluginMessage = { name: string, username: string, description: string, darkModeState: boolean, imageVariant: string };

figma.ui.onmessage = async (pluginMessage: PluginMessage) => {

  // Load font to avoid error on changing text
  await figma.loadFontAsync({ family: "Rubik", style: "Regular" });

  // Store nodes in a SceneNode to zoom in at the end
  const nodes: SceneNode[] = [];

  // Find the component set
  const set = figma.root.findOne(el => el.type === 'COMPONENT_SET' && el.name === 'post') as ComponentSetNode;

  // Select the correct variant
  const imageVariant = getImageVariantLabel(pluginMessage.imageVariant);
  const variant = set.findOne(el => el.type === 'COMPONENT' && el.name === `Image=${imageVariant}, Dark mode=${pluginMessage.darkModeState}`) as ComponentNode;
  if (!variant) return;

  // Create a copy of the variant
  const post = variant.createInstance();

  // Get variant fields
  const templateName = post.findOne(el => el.name === 'displayName' && el.type === 'TEXT') as TextNode;
  const templateUsername = post.findOne(el => el.name === '@username' && el.type === 'TEXT') as TextNode;
  const templateDescription = post.findOne(el => el.name === 'description' && el.type === 'TEXT') as TextNode;
  const templateLikesLabel = post.findOne(el => el.name === 'likesLabel' && el.type === 'TEXT') as TextNode;
  const templateCommentsLabel = post.findOne(el => el.name === 'commentsLabel' && el.type === 'TEXT') as TextNode;

  // Fill variant fields with new values
  if (templateName) templateName.characters = pluginMessage.name;
  if (templateUsername) templateUsername.characters = pluginMessage.username;
  if (templateDescription) templateDescription.characters = pluginMessage.description;
  if (templateLikesLabel) templateLikesLabel.characters = getRandomInt(1, 99).toString();
  if (templateCommentsLabel) templateCommentsLabel.characters = getRandomInt(0, 20).toString();

  // Push node in the list
  nodes.push(post);

  // Zoom the nodes
  figma.viewport.scrollAndZoomIntoView(nodes);

  // Close the plugin
  figma.closePlugin();

}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getImageVariantLabel(imageType: string) {
  switch (imageType) {
    case "2":
      return "single";

    case "3":
      return "carousel";

    default:
      return "none";
  }
}