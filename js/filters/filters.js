/**
 * Description:
 *     removes white space from text. useful for html values that cannot have spaces
 * Usage:
 *   {{some_text | nospace}}
 */
angelika.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});

angelika.filter('capitalize', function() {
  return function(input, scope) {
    if (input !== null) {
      input = input.toLowerCase();
    }
    return input.substring(0, 1).toUpperCase() + input.substring(1);
  };
});
