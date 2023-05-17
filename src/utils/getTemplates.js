import { twig } from "twig";

export const getTemplates = () => {
  const tplElements = document.querySelectorAll("[type='x-tpl']");

  const templates = Array.from(tplElements).reduce((acc, el) => {
    const name = el.getAttribute("id");

    return {
      ...acc,
      [name]: twig({
        data: el.innerHTML,
      }),
    };
  }, {});

  return templates;
};
