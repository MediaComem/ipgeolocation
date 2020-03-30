const request = require('r2');
const { stringify: stringifyQuery } = require('querystring');
const { URL } = require('url');

// Based on https://ipgeolocation.io/documentation/ip-geolocation-api.html at
// the time of writing (March 30th 2020).
exports.responseProperties = [
  'result',
  'hostname',
  'continent_code',
  'continent_name',
  'country_code2',
  'country_code3',
  'country_name',
  'country_capital',
  'state_prov',
  'district',
  'city',
  'zipcode',
  'latitude',
  'longitude',
  'is_eu',
  'calling_code',
  'country_tld',
  'languages',
  'country_flag',
  'isp',
  'connection_type',
  'organization',
  'geoname_id',
  'currency.code',
  'currency.name',
  'currency.symbol',
  'time_zone.name',
  'time_zone.offset',
  'time_zone.current_time',
  'time_zone.current_time_unix',
  'time_zone.is_dst',
  'time_zone.dst_savings'
];

exports.geolocate = async function(address, { apiKey, apiUrl }) {

  const url = new URL(apiUrl);
  url.search = stringifyQuery({
    apiKey,
    ip: address
  });

  // See "Error Codes" in
  // https://ipgeolocation.io/documentation/ip-geolocation-api.html.
  const res = await request.get(url.toString()).response;
  if (res.status === 400) {
    throw new Error('Your ipgeolocation subscription has been paused');
  } else if (res.status === 401) {
    throw new Error('Your ipgeolocation API key is invalid, has expired, or has been locked');
  } else if (res.status === 403) {
    return { result: 'invalid-ip-address' };
  } else if (res.status === 404) {
    return { result: 'ip-adress-not-found' };
  } else if (res.status === 423) {
    return { result: 'ip-address-reserved' };
  } else if (res.status !== 200) {
    throw new Error(`HTTP request to ${apiUrl} failed`);
  }

  const json = await res.json();
  return {
    ...json,
    result: 'success'
  };
}