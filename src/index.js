import {isTrue, passThrough, compose, upperCaseOf, identity} from "@7urtle/lambda";

/**
 * createLogger accepts configuration as its input and outputs an object representing a logger with methods
 * log, debug, info, warn, and error. If no configuration is provided then a default is used.
 *
 * @HindleyMilner createLogger :: object -> object
 *
 * @pure
 * @param {object} configuration
 * @return {object}
 *
 * @example
 * import createLogger from '@7urtle/logger';
 *
 * const myDefaultLogger = createLogger();
 * myDefaultLogger.log('hello world'); // => 'hello world'
 * // returns 'hello world'
 * // but prints out '19/11/2020, 3:27:25 pm; LOG: hello world' using default decorator and console.log
 *
 * const myConfiguration = {
 *     levels: {
 *         debug: false, // ignore all debug calls
 *         info: false   // ignore all info calls
 *     },
 *     decorator: level => input => `${level}: ${input}`,
 *     library: {
 *         log: () => null,
 *         debug: () => null,
 *         info: () => null,
 *         warn: () => null,
 *         error: () => null
 *     }
 * };
 *
 * const myCustomLogger = createLogger(myConfiguration);
 * myCustomLogger.debug('hello world'); // => 'hello world'
 * // returns 'hello world' but because debug level is false, the library function is not called
 *
 * myCustomLogger.log('hello world'); // => 'hello world'
 * // returns 'hello world' and library function is called defined as () => null
 */
const createLogger = configuration => getLogger({
  levels: {
    log: true,
    debug: true,
    info: true,
    warn: true,
    error: true,
    ...(configuration && configuration.levels)
  },
  library: configuration && configuration.library || console,
  decorator: configuration && configuration && configuration.decorator || defaultDecorator
});

/**
 * defaultDecorator is the default decorator used by the default configuration of createLogger. It expects as inputs
 * string of a level and a message. It outputs a string in format 'TIME; LEVEL: message', for
 * example: '19/11/2020, 3:27:25 pm; DEBUG: hello world'.
 *
 * This function is not pure because it depends on the value of Date object.
 *
 * @HindleyMilner defaultDecorator :: string -> string -> string
 *
 * @param {string} level
 * @param {string} message
 * @return {string}
 *
 * @example
 * import {defaultDecorator} '@7urtle/logger';
 *
 * defaultDecorator('apocalyptic')('server meltdown');
 * // => '29/08/1997, 11:12:22 pm; APOCALYPTIC: server meltdown'
 */
const defaultDecorator = level => message =>
  new Date().toLocaleString() + '; ' + upperCaseOf(level) + ': ' + message;

/**
 * getLogger accepts configuration and returns an object with logging methods with a behavior depending on the
 * configuration passed to the function log. Provided methods are log, debug, info, warn, and error.
 *
 * @HindleyMilner getLogger :: object -> object
 *
 * @pure
 * @param {object} configuration
 * @return {object}
 *
 * @example
 * import {getLogger} '@7urtle/logger';
 *
 * const myConfiguration = {
 *     levels: {
 *         log: true,
 *         debug: false,
 *         info: true,
 *         warn: true,
 *         error: true
 *     },
 *     decorator: level => input => `${level}: ${input}`,
 *     library: console.log
 * };
 *
 * const myLogger = getLogger(myConfiguration);
 *
 * myLogger.error('hello error'); // => 'hello error'
 * // returns 'hello error'
 * // but prints out 'error: hello error' using provided decorator and console.log
 *
 * myLogger.debug('turned off'); // => 'turned off'
 * // returns 'turned off'
 * // but doesnt call the library function because debug level is false in the configuration
 */
const getLogger = configuration => ({
  log: log(configuration)('log'),
  debug: log(configuration)('debug'),
  info: log(configuration)('info'),
  warn: log(configuration)('warn'),
  error: log(configuration)('error')
});

/**
 * log accepts configuration and current level as an input. If current level is set as true in provided configuration
 * it returns a logging function. The logging function uses configuration decorator to decorate logging message and
 * passes to the appropriate library logging function, however, it returns its original message as its output. If the
 * current level is set as false in the provided configuration then the log function simply returns identity which outputs
 * its input without any change and without calling the configuration library logging function.
 *
 * @HindleyMilner getLogger :: object -> object
 *
 * @pure
 * @param {object} configuration
 * @param {string} level
 * @return {object}
 *
 * @example
 * import {log} '@7urtle/logger';
 *
 * const myConfiguration = {
 *     levels: {
 *         log: true,
 *         debug: false,
 *         info: true,
 *         warn: true,
 *         error: true
 *     },
 *     decorator: level => input => `${level}: ${input}`,
 *     library: console.log
 * };
 *
 * log(myConfiguration)('info')('message'); // => 'message'
 * // returns 'message'
 * // but prints out 'info: message' using provided decorator and console.log
 *
 * log(myConfiguration)('debug')('turned off'); // => 'turned off'
 * // returns 'turned off'
 * // but doesnt call the library function because debug level is false in the configuration
 */
const log = configuration => level =>
  isTrue(configuration.levels[level])
    ? passThrough(compose(configuration.library[level], configuration.decorator(level)))
    : identity;

export default createLogger;

export {
  defaultDecorator,
  getLogger,
  log
};