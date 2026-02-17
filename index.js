const config                = require('./config/index.config.js');
const Cortex                = require('ion-cortex');
const ManagersLoader        = require('./loaders/ManagersLoader.js');
const Aeon                  = require('aeon-machine');
const mongoConnection       = require('./connect/mongo.js'); 

// NOTE: Initialize MongoDB first to satisfy persistence requirements [cite: 13, 33]
mongoConnection({ uri: config.dotEnv.MONGO_URI });

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception:`, err);
    process.exit(1);
});

// NOTE: Define the cache (Redis) instance
const cache = require('./cache/cache.dbh')({
    prefix: config.dotEnv.CACHE_PREFIX,
    url: config.dotEnv.CACHE_REDIS
});

// NOTE: Define the Oyster instance
const Oyster = require('oyster-db');
const oyster = new Oyster({ 
    url: config.dotEnv.OYSTER_REDIS, 
    prefix: config.dotEnv.OYSTER_PREFIX 
});

// NOTE: Define the Cortex instance
const cortex = new Cortex({
    prefix: config.dotEnv.CORTEX_PREFIX,
    url: config.dotEnv.CORTEX_REDIS,
    type: config.dotEnv.CORTEX_TYPE,
    state: () => { return {} },
    activeDelay: "50",
    idlDelay: "200",
});

// NOTE: Define the Aeon instance
const aeon = new Aeon({ cortex, timestampFrom: Date.now(), segmantDuration: 500 });

/** * NOTE: Now that all dependencies (config, cache, cortex, oyster, aeon) 
 * are defined, we pass them into the loader.
 */
const managersLoader = new ManagersLoader({ config, cache, cortex, oyster, aeon });
const managers = managersLoader.load();

// NOTE: Start the server on the ports defined in config [cite: 11]
managers.userServer.run();