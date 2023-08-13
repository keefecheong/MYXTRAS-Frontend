// to store resolve function for alert

import { v4 as uuidv4 } from "uuid";

let resolveMap = {};

// create uuid and store resolve function
export const createResolveId = (resolve) => {
    const id = uuidv4();
    resolveMap[id] = resolve;
    return id;
};

// call resolve function and remove from map
export const resolve = (id) => {
    resolveMap[id]();
    delete resolveMap[id];

    return null;
};
