/* eslint-env browser, node */
function isDataURL(str) {
  if (str === null) {
    return false;
  }
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i;
  return !!str.match(regex);
}

export default function loadImageURL(imageURL, crossOrigin) {
  return new Promise((resolve, reject) => {
    const image = new Image(200, 200);
    // image.onload = () => resolve(image);
    image.onload = () => {
      console.log('image is onloaded');
    };
    // image.onerror = reject;
    image.onerror = () => {
      console.log('onload error');
    };
    if (isDataURL(imageURL) === false && crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.src = imageURL; // 图片的输出路径不对，加载失败
  });
}
