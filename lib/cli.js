const { pick } = require('lodash');
const yargs = require('yargs');

exports.config = function(args = process.argv) {

  const program = yargs
    .usage("ipgeolocation [options...]")
    .env('IPGEOLOCATION')
    .option('apiKey', {
      alias: [ 'k', 'api-key' ],
      demandOption: true,
      description: 'Provide your ipgeolocation API key',
      type: 'string'
    })
    .option('apiUrl', {
      alias: [ 'u', 'api-url' ],
      default: 'https://api.ipgeolocation.io/ipgeo',
      description: 'Change the default ipgeolocation API URL',
      type: 'string'
    })
    .option('input', {
      alias: 'i',
      default: '-',
      description: 'CSV input file (- for standard input)',
      type: 'string'
    })
    .option('output', {
      alias: 'o',
      description: 'CSV output file (standard output if not specified)',
      type: 'string'
    })
    .help()
    .parse(args);

  return pick(program, 'apiKey', 'apiUrl', 'input', 'output');
};