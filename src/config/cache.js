import NodeCache from "node-cache";

const tokenCache = new NodeCache({
    stdTTL: 60 * 10,
});

export default tokenCache;