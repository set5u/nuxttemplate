// @ts-nocheck
/* eslint-disable */
export default (matched) => {
  return {
    name: "vite-plugin-replace-resolve-component",
    transform(src, id) {
      let ret = src;
      ret = ret.replaceAll(
        /(?<!function )(_?resolveComponent)\(["']([^\)]+?)["']\)/g,
        (_, resolve, name) => {
          const ret = `__${resolve}${name}`;
          matched.indexOf(ret) === -1 && matched.push(ret);
          return `"${ret}"`;
        },
      );
      [...ret.matchAll(/import\(\"([^\"]*)\"\)/g)].forEach(
        (v) => matched.indexOf(v[1]) === -1 && matched.push(v[1]),
      );
      return {
        code: ret,
        map: null,
      };
    },
  };
};
