export default [
  '{{string.alpha({ "casing": "upper" , "length": 2})}}{{string.numeric}} {{string.numeric}}{{string.alpha({ "casing": "upper" , "length": 2})}}',
  '{{string.alpha({ "casing": "upper" , "length": 2})}}{{string.numeric(2)}} {{string.numeric}}{{string.alpha({ "casing": "upper" , "length": 2})}}',
];
