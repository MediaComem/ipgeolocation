const chalk = require('chalk');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const { createReadStream, createWriteStream } = require('fs');
const { isPrivate, isV4Format, isV6Format } = require('ip');
const { constant, get, reduce } = require('lodash');
const ora = require('ora');

const { config } = require('./cli');
const { geolocate, responseProperties } = require('./ipgeolocation');

const spinner = ora('Reading input...');

Promise.resolve().then(execute).catch(fail);

const emptyStringFactory = constant('');

async function execute() {

  const options = config();
  const stdout = !options.output;

  if (!stdout) {
    process.stderr.write(chalk.yellow(`Saving results to ${options.output}\n`));
    spinner.start();
  }

  const inputStream = options.input === '-' ? process.stdin : createReadStream(options.input, 'utf8');
  const parser = inputStream.pipe(parse({
    from_line: 2
  }));

  const stringifier = stringify({
    delimiter: ','
  });

  stringifier.on('error', fail);

  const outputStream = options.output ? createWriteStream(options.output, 'utf8') : process.stdout;
  stringifier.pipe(outputStream);

  stringifier.write([ 'ip', 'type', ...responseProperties ]);

  const counters = {
    invalid: 0,
    private: 0,
    ipv4: 0,
    ipv6: 0
  };

  for await (const record of parser) {

    const address = record[0];

    let geolocation;
    let type;
    if (isPrivate(address)) {
      type = 'private';
      counters.private++;
    } else if (isV4Format(address)) {
      type = 'ipv4';
      counters.ipv4++;
      spinner.text = `Geolocating ${address}...`;
      geolocation = await geolocate(address, options);
    } else if (isV6Format(address)) {
      type = 'ipv6';
      counters.ipv6++;
      spinner.text = `Geolocating ${address}...`;
      geolocation = await geolocate(address, options);
    } else {
      type = 'invalid';
      counters.invalid++;
    }

    if (geolocation) {
      stringifier.write([ address, type, ...responseProperties.map(prop => get(geolocation, prop)) ]);
    } else {
      stringifier.write([ address, type, 'skip', ...responseProperties.slice(1).map(emptyStringFactory) ]);
    }
  }

  if (!stdout) {
    spinner.succeed(reduce(counters, (memo, value, key) => [ ...memo, `${key}: ${value}` ], []).join(', '));
  }
}

function fail(err) {
  spinner.fail(err.message);
  console.error(chalk.red(err.stack));
  process.exit(1);
}