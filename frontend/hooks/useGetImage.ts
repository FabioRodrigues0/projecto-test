// ImageMapping.ts
type ImageMap = Record<string, any>;

export default function getImageMapping(): ImageMap {
  const images: ImageMap = {
    "banana.png": require("@images/banana.png"),
    "alface.png": require("@images/alface.png"),
    "cenoura.png": require("@images/cenoura.png"),
    // todos os caminhos possíveis
  };
  return images;
}
