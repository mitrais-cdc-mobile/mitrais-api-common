"use strict";

const path = require('path');
const appRoot = require('app-root-path');

module.exports = (Model) => {
    // Clear existing ACLs that are built-in the Model's base class.
    Model.settings.acls.length = 0;
    
    // Setup ACLs for this Model where the ACLs are defined in Model.json file
    
    // A helper method to 'slugify' model's name in order to get correct model's .JSON filename.
    // (E.g: Model's name is ElectronicItem. Then slugified Model's name will be electronic-item)
    const slugify = (name) => {
        name = name.replace(/^[A-Z]+/, s => s.toLowerCase());
        return name.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
    };
    
    // Get the path of Model's .json file
    const configFile = path.join('./common/models', slugify(Model.modelName) + '.json');
    
    // Get JSON object defined in .json file through using app-root-path component 
    // ( run npm install app-root-path --save to include in this project)
    const config = appRoot.require(configFile);
    
    // Check whether the config object is undefined or the expected acls array does not exist  
    if (!config || !config.acls){
        console.log('ClearBaseAcls: Failed to load model config from ', configFile);
        return;
    }
    
    // Apply each acl settings inside the config into Model's acl settings        
    config.acls.forEach(acl=> Model.settings.acls.push(acl));    
            
};