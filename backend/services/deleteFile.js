const fs = require("fs");

function deleteImage(imageUrl) {
  if (!imageUrl) return;
  const filename = imageUrl.split("/images/")[1];
  fs.unlink(`images/${filename}`, () => {});
}

module.exports = {
  deleteImage,
};
