/* eslint-env browser, node */
import loadImageURL from './loadImgUrl';

export default function loadImageFile(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // FileReader对象用于异步读取需要处理的图片
    reader.readAsDataURL(imageFile); // 读取imageFile对象，读取成功后reader对象的result属性将包含图像的base64编码
    reader.onload = e => {
      try {
        const image = loadImageURL(e.target.result);
        resolve(image);
      } catch (e) {
        reject(e);
      }
    };
  });
}
