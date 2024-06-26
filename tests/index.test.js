import logger, {defaultDecorator, getLogger, log} from '../src/index';

// getMockLibrary :: [string] -> object
const getMockLibrary = stack => ({
  log: message => stack.push(message),
  debug: message => stack.push(message),
  info: message => stack.push(message),
  warn: message => stack.push(message),
  error: message => stack.push(message)
});

test('logger works without configuration.', () => {
  const myLogger = logger();

  expect(myLogger.log('hello world')).toBe('hello world');
  expect(myLogger.info('hello world')).toBe('hello world');
  expect(myLogger.debug('hello world')).toBe('hello world');
  expect(myLogger.warn('hello world')).toBe('hello world');
  expect(myLogger.error('hello world')).toBe('hello world');
});

test('logger works with configuration.', () => {
  let stack = [];

  const myConfiguration = {
    levels: {
      debug: false, // ignore all debug calls
      info: false   // ignore all info calls
    },
    decorator: level => input => `${level}: ${input}`,
    library: getMockLibrary(stack)
  };

  const myLogger = logger(myConfiguration);

  expect(myLogger.log('hello world')).toBe('hello world');
  expect(myLogger.info('hello world')).toBe('hello world');
  expect(myLogger.debug('hello world')).toBe('hello world');
  expect(myLogger.warn('hello world')).toBe('hello world');
  expect(myLogger.error('hello world')).toBe('hello world');
  expect(stack).toEqual([
      'log: hello world',
      'warn: hello world',
      'error: hello world'
  ])
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

  const myLogger = getLogger(myConfiguration);

  expect(myLogger.log('hello world')).toBe('hello world');
  expect(myLogger.info('hello world')).toBe('hello world');
  expect(myLogger.debug('hello world')).toBe('hello world');
  expect(myLogger.warn('hello world')).toBe('hello world');
  expect(myLogger.error('hello world')).toBe('hello world');
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

test('log supports multiple message arguments.', () => {
  let stack = [];

  const myConfiguration = {
    levels: {
      log: true
    },
    decorator: level => input => `${level}: ${input}`,
    library: {log: (...message) => stack.push(message)}
  };
  expect(log(myConfiguration)('log')('hello world', 'i am a turtle')).toEqual(['hello world', 'i am a turtle']);
  expect(stack).toEqual([
    ['log: hello world', 'i am a turtle']
  ])
});

test('logger works with UTF characters.', () => {
  const myLogger = logger();

  expect(myLogger.log({ test: 'Příliš žluťoučký kůň úpěl ďábelské ódy' }))
  .toEqual({ test: 'Příliš žluťoučký kůň úpěl ďábelské ódy' });
});