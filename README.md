# ipgeolocation

> Get the geolocation of IP addresses in a CSV file using
> https://ipgeolocation.io.

This tool expects a CSV file with IP addresses in the first column and a
one-line header, for example:

```csv
IP Address,Whatever
100.101.102.103,foo
104.105.106.107,bar
200.201.202.203,baz
```

It will output a CSV file with geolocation data about each IP address. This is a
simplified example of the output:

```csv
ip,type,result,country_code2,country_name,state_prov,city,...
100.101.102.103,ipv4,success,US,United States,New York,Syracuse,...
104.105.106.107,ipv4,success,US,United States,Wisconsin,Canton,...
200.201.202.203,ipv4,success,US,United States,Colorado,Denver,...
```

The description of all returned geolocation data can be found here:
https://ipgeolocation.io/documentation/ip-geolocation-api.html

**NOTE: you need a (free) [ipgeolocation](https://ipgeolocation.io) account and API key.**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

* [Node.js](https://nodejs.org) 12+

## Installation

```bash
npm install --global @mediacomem/ipgeolocation
```

> Or with [npx](https://github.com/npm/npx#readme):
>
> ```bash
> npx @mediacomem/ipgeolocation --help
> ```

## Usage

```
ipgeolocation [options...]

Options:
  --version                Show version number                         [boolean]
  --apiKey, -k, --api-key  Provide your ipgeolocation API key[string] [required]
  --apiUrl, -u, --api-url  Change the default ipgeolocation API URL
                        [string] [default: "https://api.ipgeolocation.io/ipgeo"]
  --input, -i              CSV input file (- for standard input)
                                                         [string] [default: "-"]
  --output, -o             CSV output file (standard output if not specified)
                                                                        [string]
  --help                   Show help                                   [boolean]
```

## Examples

* Geolocate IP addresses in a CSV file and save the results to another file:

      ipgeolocation -i input.csv -o output.csv --api-key CHANGEME
* Geolocate IP adresses in CSV from standard input and print the results to
  standard output:

      cat input.csv | ipgeolocation --api-key CHANGEME > output.csv