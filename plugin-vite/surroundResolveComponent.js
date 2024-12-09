// @ts-nocheck

export default () => {
  return {
    name: "vite-plugin-surround-resolve-component",
    transform(src) {
      let ret = src;
      ret = ret.replaceAll(
        /["']__(_?resolveComponent)([^"']+)["']/g,
        (_, resolve, name) => `(${resolve}("${name}"))`,
      );
      return {
        code: ret,
        map: null,
      };
    },
  };
};
