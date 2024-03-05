const https = require("https");

function getIndexPromises(){
    let promises = [];
    for(let i = 0; i < 15; i++){
        promises.push(new Promise((resolve, reject) => {
            let html = "";
            https.get(process.argv[2] + i, res => {
                res.on("error", error => {
                    reject(error);
                })
                res.on("data", data => {
                    html += data;
                })
                res.on("end", () => {
                    resolve(html);
                })
            })
        }))
    }
    return promises;
}

function getModules(indexHtml){
    const getModuleRegex = /(<a href=")(\/modules\/.+)(">)/gm;
    let matches = [...indexHtml.matchAll(getModuleRegex)]
    let modulesUnsanitised = [];
    let modules = [];
    for(let i = 0; i < matches.length; i++){
        modulesUnsanitised.push(matches[i][2]);
    }
    modules = [...new Set(modulesUnsanitised)];
    return modules;
}

function getModulePromises(modules){
    let promises = [];
    for(let i = 0; i < modules.length; i++){
        promises.push(new Promise((resolve, reject) => {
            let html = "";
            https.get("https://courses.warwick.ac.uk" + modules[i], res => {
                res.on("error", error => {
                    reject(error);
                })
                res.on("data", data => {
                    html += data;
                })
                res.on("end", () => {
                    resolve(html);
                })
            })
        }))
    }
    return promises;
}

function manipulateModuleData(modulesHtml){
    console.log("name|department|level|leader|credit|duration|assessment")
    const moduleNameRegex = /(?<=<title>).+(?= - Module Catalogue<\/title>)/gm;
    const moduleDepartmentRegex = /(?<=<span id="module-department-name">).+(?=<\/span>)/gm;
    const moduleLevelRegex = /(?<=<dd id="module-level-name">).+(?=<\/dd>)/gm;
    const moduleLeaderRegex = /(<dd id="module-leader">\s+)(.*?)(\s+<a)/gm;
    const moduleAssessmentRegex = /(<dd id="module-assessment-split">\s+)(.+)(\s+<\/dd>)/gm;
    const moduleDescriptionRegex = /(<h5>Introductory Description<\/h5>[\S\s]+?)([\S\s]+)([\s\S]+?<h5>)/gm;
    let moduleNames = [...modulesHtml.matchAll(moduleNameRegex)];
    let moduleDepartments = [...modulesHtml.matchAll(moduleDepartmentRegex)];
    let moduleLevel = [...modulesHtml.matchAll(moduleLevelRegex)];
    let moduleLeader = [...modulesHtml.matchAll(moduleLeaderRegex)];
    let moduleAssessment = [...modulesHtml.matchAll(moduleAssessmentRegex)];
    let moduleDescription = [...modulesHtml.matchAll(moduleDescriptionRegex)];
    for(let i = 0; i < moduleNames.length; i++){
        console.log(`${moduleNames[i][0]}|${moduleDepartments[i][0]}|${moduleLevel[i][0]}|${moduleLeader[i][2]}|${moduleAssessment[i][2]}|${moduleDescription[i][2]}`);
    }
}

function main(){
    Promise.all(getIndexPromises()).then( indexHtml => {
        Promise.all(getModulePromises(getModules(indexHtml.join()))).then( moduleHtml => {
            manipulateModuleData(moduleHtml.join().replace("\n", ""))
        });
    })
}

main();

