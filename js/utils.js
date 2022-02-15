const selectElement = (element, node = document) => {
  return node.querySelector(element);
};

const selectElements = (element, node = document) => {
  return node.querySelectorAll(element);
};
