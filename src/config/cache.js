import NodeCache from "node-cache";

export const tokenWhiteList = new NodeCache({
    stdTTL: parseInt(process.env.JWT_ACCESS_EXPIRES),
});