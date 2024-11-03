export default [
  '{{helpers.fromRegExp("[A-Z]{1,2}[0-9]{1,2} [0-9][ABDEFGHJLNPQRSTUWXYZ]{2}")}}',
  '{{helpers.fromRegExp("[A-Z]{1,2}[0-9][A-Z] [0-9][ABDEFGHJLNPQRSTUWXYZ]{2}")}}',
];
