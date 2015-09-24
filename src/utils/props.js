/*
{}, 'user.name', 'get'
*/

export function process(props, path, nextFnName, defaultValue, processAll) {
  if (!path) {
    return processAll(props);
  }

  const pos = path.indexOf('.');
  if (pos === -1) {
    const prop = props[path];
    return prop && prop[nextFnName] ? prop[nextFnName]() : defaultValue;
  }

  const currentKey = path.substr(0, pos);
  const newPath = path.substr(pos + 1);
  const prop = props[currentKey];
  return prop && prop[nextFnName] ? prop[nextFnName](newPath) : defaultValue;
}
