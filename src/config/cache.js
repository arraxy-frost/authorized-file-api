import NodeCache from "node-cache";

const tokenCache = new NodeCache({
    stdTTL: parseInt(process.env.JWT_ACCESS_EXPIRES),
});

export default tokenCache;