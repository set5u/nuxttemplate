<template lang="pug">
slot(v-if="loading")
component(:is, v-else)
</template>

<script lang="ts">
export type LayerRouter = {
  history: string[][];
  queries: Record[];
  back: (i?: number) => void;
  push: (path: string[], query?: Record) => void;
  replace: (path: string[], query?: Record) => void;
};
export const routerI = "ROUTER_I" as unknown as InjectionKey;
export type LayerRoute = {
  path: string;
  pathes: string[];
  query: Record;
};
export const routeI = "ROUTE_I" as unknown as InjectionKey;
export const depthI = "DEPTH_I" as unknown as InjectionKey;
const layersI = "LAYERS_I" as unknown as InjectionKey;
</script>

<script setup lang="ts">
const props = defineProps<{
  layers?: Record;
}>();

const injectedLayers = inject(layersI, undefined);
if (!injectedLayers && !props.layers) {
  throw new Error("No layers provided");
}
if (props.layers) {
  provide(layersI, props.layers);
}
const pLayers = inject(layersI, props.layers!);
const depth = inject(depthI, 0);
let router = inject(routerI, undefined);
provide(depthI, depth + 1);
if (!router) {
  const history: string[][] = reactive([]);
  const queries: Record[] = shallowReactive([]);
  const back = (i = 1) => {
    history.splice(-i, history.length);
    queries.splice(-i, queries.length);
  };
  const push = (path: string[], query?: Record) => {
    history.push(path);
    queries.push(query || {});
  };
  const replace = (path: string[], query?: Record) => {
    back();
    history.push(path);
    queries.push(query || {});
  };
  router = { history, queries, back, push, replace };
  provide(routerI, router);
}
const route = reactive({
  path: computed(
    () =>
      router.history[router.history.length - 1]?.[depth] ||
      (depth ? "" : "index"),
  ),
  pathes: computed(
    () => router.history[router.history.length - 1] || ["index"],
  ),
  query: computed(() => router.queries[router.queries.length - 1] || {}),
});
provide(routeI, route);
const loading = ref(false);
const parents = route.pathes.slice(0, depth);
const is = shallowRef<Component>(() => null);
watch(
  router.history,
  async () => {
    if (
      router.history[router.history.length - 1]
        ?.slice(0, depth)
        .some((v, i) => parents[i] !== v)
    ) {
      is.value = () => null;
      return;
    }
    const s = window.setTimeout(() => (loading.value = true), 1000);
    const i = await (depth && route.path == null
      ? () => () => null
      : pLayers[
          router.history[router.history.length - 1]?.[depth - 1] + "Param"
        ] ||
          pLayers[route.path] ||
          (!depth && (pLayers["404"] || (() => () => h("div", "404")))) ||
          (() => () => null))();
    clearTimeout(s);
    loading.value = false;
    if (is.value === i) {
      return;
    }
    is.value = i;
  },
  { immediate: true },
);
</script>
