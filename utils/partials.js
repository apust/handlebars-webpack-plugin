const fs = require("fs");
const glob = require("glob");
const chalk = require("chalk");
const log = require("./log");


function getId(path, pathGlob) {
    const re = new RegExp(pathGlob.replace(/\/?$/, '/') + '([^\/]+(?:\/[^\/.]+)+)\.[^.]+$');
    return path.match(re).pop();
}

function resolve(Handlebars, partialsGlob, pathGlob) {
    let partials = [];

    if (partialsGlob == null) {
        return {};
    }

    partialsGlob.forEach((partialGlob) => {
        partials = partials.concat(glob.sync(partialGlob));
    });

    const partialMap = {};
    partials.forEach((path) => {
        partialMap[getId(path, pathGlob)] = path;
    });

    return partialMap;
}

function addMap(Handlebars, partialMap) {
    Object.keys(partialMap).forEach((partialId) => {
        log(chalk.gray(`+ partial '${partialId}'`));
        Handlebars.registerPartial(partialId, fs.readFileSync(partialMap[partialId], "utf8"));
    });
}


module.exports = {

    getId,
    resolve,
    addMap
};
