import createLogger, {defaultDecorator, getLogger, log} from '../src/index';

// getMockLibrary :: [string] -> object
const getMockLibrary = stack => ({
  log: message => stack.push(message),
  debug: message => stack.push(message),
  info: message => stack.push(message),
  warn: message => stack.push(message),
  error: message => stack.push(message)
});

test('createLogger works without configuration.', () => {
  const logger = createLogger();

  expect(logger.log('hello world')).toBe('hello world');
  expect(logger.info('hello world')).toBe('hello world');
  expect(logger.debug('hello world')).toBe('hello world');
  expect(logger.warn('hello world')).toBe('hello world');
  expect(logger.error('hello world')).toBe('hello world');
});

test('createLogger works with configuration.', () => {
  let stack = [];

  const myConfiguration = {
    levels: {
      debug: false, // ignore all debug calls
      info: false   // ignore all info calls
    },
    decorator: level => input => `${level}: ${input}`,
    library: getMockLibrary(stack)
  };

  const logger = createLogger(myConfiguration);

  expect(logger.log('hello world')).toBe('hello world');
  expect(logger.info('hello world')).toBe('hello world');
  expect(logger.debug('hello world')).toBe('hello world');
  expect(logger.warn('hello world')).toBe('hello world');
  expect(logger.error('hello world')).toBe('hello world');
  expect(stack).toEqual([
      'log: hello world',
      'warn: hello world',
      'error: hello world'
  ])
});

test('createLogger works without configuration.', () => {
  const logger = createLogger();

  expect(logger.log('hello world')).toBe('hello world');
  expect(logger.info('hello world')).toBe('hello world');
  expect(logger.debug('hello world')).toBe('hello world');
  expect(logger.warn('hello world')).toBe('hello world');
  expect(logger.error('hello world')).toBe('hello world');
});

test('defaultDecorator decorates around level and message', () => {
  expect(defaultDecorator('apocalyptic')('server meltdown').includes('; APOCALYPTIC: server meltdown')).toBe(true);
});

test('getLogger works with configuration.', () => {
  let stack = [];

  const myConfiguration = {
    levels: {
      log: true,
      debug: false, // ignore all debug calls
      info: false,   // ignore all info calls
      warn: true,
      error: true
    },
    decorator: level => input => `${level}: ${input}`,
    library: getMockLibrary(stack)
  };

  const logger = getLogger(myConfiguration);

  expect(logger.log('hello world')).toBe('hello world');
  expect(logger.info('hello world')).toBe('hello world');
  expect(logger.debug('hello world')).toBe('hello world');
  expect(logger.warn('hello world')).toBe('hello world');
  expect(logger.error('hello world')).toBe('hello world');
  expect(stack).toEqual([
    'log: hello world',
    'warn: hello world',
    'error: hello world'
  ])
});

test('log works with configuration and level.', () => {
  let stack = [];

  const myConfiguration = {
    levels: {
      log: true,
      debug: false, // ignore all debug calls
      info: false,   // ignore all info calls
      warn: true,
      error: true
    },
    decorator: level => input => `${level}: ${input}`,
    library: getMockLibrary(stack)
  };

  expect(log(myConfiguration)('log')('hello world')).toBe('hello world');
  expect(log(myConfiguration)('info')('hello world')).toBe('hello world');
  expect(log(myConfiguration)('debug')('hello world')).toBe('hello world');
  expect(log(myConfiguration)('warn')('hello world')).toBe('hello world');
  expect(log(myConfiguration)('error')('hello world')).toBe('hello world');
  expect(stack).toEqual([
    'log: hello world',
    'warn: hello world',
    'error: hello world'
  ])
});