//Written by Cameron Haddock
//A Screeps module for mass producing creeps

/**
 * The core factory loop
 */
module.exports.produce = function() {
    for(var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName]
        if(spawn.spawning != null || Memory.NUMERICS.CREEP_COUNT >= Memory.NUMERICS.CREEP_COUNT_EXPECTED)
            return


        if(spawn.memory.NEXT_SPAWN.COST == -1) {
            spawn.memory.NEXT_SPAWN = this.findNext(spawn);
        }
        
        if(spawn.memory.NEXT_SPAWN.COST > -1 && spawn.memory.NEXT_SPAWN.COST <= spawn.room.energyAvailable) {
            var x = this.create(spawn,spawn.memory.NEXT_SPAWN.ROLE,spawn.memory.NEXT_SPAWN.NAME)
            spawn.memory.NEXT_SPAWN = this.findNext(spawn);
        }
    }
}


/**
 * Calculated the energy cost of a creep with the given loadout
 * @param {String[]} loadout - What loadout to check the cost of
 * @returns {number} - How much the creep would cost
 */
module.exports.determineCost = function(loadout) {
    var cost = 0
    for(var partNum in loadout) {
        cost += BODYPART_COST[loadout[partNum]]
    }
    return cost
}


/**
 * Find the next role priorities for a given spawn
 * @param {StructureSpawn} spawn - Which spawn to use
 * @returns {Object} - An array of JSON objects containing the name and priority of each role
 */
function getPriorityArray(spawn) {
    var roles = Memory.ROLES

    //Change priorities based on current room conditions
    if (spawn.room.find(FIND_CONSTRUCTION_SITES).length() == 0) {
        
    }

    //roles['BUILDER']['base_priority']
    var roleEntries = Object.entries(Memory.ROLES)
    var roleNames = _.map(roleEntries,entry => {return {'name': entry[0],'priority': entry[1]['base_priority']}})
    var roleOrdered = _.sortByOrder(roleNames,'priority')
    //var roleNamesOrdered = _.map(roleNames,entry => {return entry['name']})
    return roleOrdered
}


/**
 * Find the next creep that a given spawn may wish to build
 * @param {StructureSpawn} spawn - Which spawn to use
 * @returns {Object} - A JSON object containing the cost, role, and name of the potential next creep
 */
module.exports.findNext = function(spawn) {
    for(var i = 0; i < Memory.NUMERICS.ROLES; i++) {
        var roleName = Object.keys(Memory.ROLES)[i]
        var role = Memory.ROLES[roleName]

        var build = false
        var worker_name
        for(var j = 1; j <= role.count; j++) {
            worker_name = role.name + j.toString()
            var rv = this.create(spawn,roleName,worker_name,true)
            if(rv == OK) {
                build = true
                break
            }
        }

        if(build) {
            var cost = this.determineCost(role.loadouts[0])
            console.log("Found next creep to build:",worker_name)
            return {"COST":cost,"ROLE":roleName,"NAME":worker_name}
        }
    }
    return {"COST":-1,"ROLE":"","NAME":""}
}



/**
 * Spawn a creep at a given spawn, with a given role and name
 * @param {StructureSpawn} spawn - What spawn to create the creep at
 * @param {String} roleName - What role to make a creep out of
 * @param {String} name - What to name the creep being made
 * @param {Boolean} dry - Whether to create as a dry run (Pretend to build to get return values)
 * @returns {ScreepsReturnCode}
 */
module.exports.create = function(spawn,roleName,name,dry=false) {
    var role = Memory.ROLES[roleName]
    var rv = spawn.spawnCreep(role.loadouts[0],name,{"dryRun":dry,memory:{'role':role.name,'working':true}})
    if(rv != OK && rv != ERR_NAME_EXISTS && !dry)
        console.log("Failed to create creep:",Memory.ERRORS[rv.toString()],"\n\t",spawn.name,roleName,name,dry)
    return rv
}


/**
 * Keep a given role at a steady number of creeps
 * @param {String} roleName - The name of a creep role. Ex: HARVESTER
 * @returns {Boolean}
 */
module.exports.maintainRole = function(roleName) {
    var creating = false
    var role = Memory.ROLES[roleName]
    for (var i = role.count; i > 0; i--) {
        var worker_name = role.name + i.toString()
        if(this.create(Game.spawns.Spawn1,roleName,worker_name) == OK)
            creating = true
    }  
    if(creating) {
        console.log('Creating a new', role.name)
        return true
    }
    return false
}