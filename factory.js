/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('factory');
 * mod.thing == 'a thing'; // true
 */



module.exports.produce = function() {
    for(var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName]
        if(spawn.spawning != null || Memory.NUMERICS.CREEP_COUNT >= Memory.NUMERICS.CREEP_COUNT_EXPECTED)
            return

        spawn.memory
        if(!Object.keys(spawn).includes("NEXT_SPAWN")){
            spawn.memory.NEXT_SPAWN = {"COST":-1,"ROLE":"","NAME":""}
        }

        if(spawn.memory.NEXT_SPAWN.COST == -1) {
            spawn.memory.NEXT_SPAWN = this.findNext();
        }
        
        if(spawn.memory.NEXT_SPAWN.COST > -1 && spawn.memory.NEXT_SPAWN.COST <= spawn.room.energyAvailable) {
            var x = this.create(spawn,spawn.memory.NEXT_SPAWN.ROLE,spawn.memory.NEXT_SPAWN.NAME)
            spawn.memory.NEXT_SPAWN = this.findNext();
        }
    }
}


module.exports.determineCost = function(loadout) {
    var cost = 0
    for(var partNum in loadout) {
        cost += BODYPART_COST[loadout[partNum]]
    }
    return cost
}


module.exports.findNext = function() {
    for(var i = 0; i < Memory.NUMERICS.ROLES; i++) {
        var roleName = Memory.ROLES.ROLE_PRIORITIES[i]
        var role = Memory.ROLES.ROLES[roleName]

        var build = false
        var worker_name
        for(var j = 1; j <= role.count; j++) {
            worker_name = role.name + j.toString()
            var rv = this.create(Game.spawns.Spawn1,roleName,worker_name,true)
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


module.exports.create = function(spawn,roleName,name,dry=false) {
    var role = Memory.ROLES.ROLES[roleName]
    var rv = spawn.spawnCreep(role.loadouts[0],name,{"dryRun":dry,memory:{'role':role.name,'working':true}})
    if(rv != OK && rv != ERR_NAME_EXISTS)
        console.log("Failed to create creep:",Memory.ERRORS[rv.toString()],"\n\t",spawn.name,roleName,name,dry)
    return rv
}



module.exports.maintainRole = function(roleName) {
    var creating = false
    var role = Memory.ROLES.ROLES[roleName]
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