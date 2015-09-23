## `babel-plugin-global-require`
```
npm install babel-plugin-global-require --save-dev
```

Tell the plugin where's your *root*, *node_modules* and what to *exclude* by creating a new `.global-require` file:

```JSON
{
  "root": "src",
  "exclude": "node_modules",
  "node_modules": "node_modules"
}
```

P.S: `exclude` and `node_modules` are optional. You'll know when to use it.

See the examples above of how to configure. Take which fits best for your setup. Profit.

A simple plugin that allows you to require globally. You just
need to define the *root* directory of your project and this plugin will generate a global alias map.

It's convention based: the alias is always the name of the file. For example:
```
src (root)
  deep
    deep
      deep
        sum.js
      NuclearEventEmitter.js
```

With this plugin, you can:
```JS
import NuclearEventEmitter from 'NuclearEventEmitter'
import sum from 'sum'
```

It will translate `'NuclearEventEmitter'` to `src/deep/deep/NuclearEventEmitter.js` for you. And the same happens to `sum`.

### But what about conflicts?
Given the following structure:
```
src
  deep
    math
      sum.js
      div.js
  math
    sum.js
    div.js
```

You can't require `sum.js` or `div.js` only by its name, because it could result in a require of undesired file. So, for this specific case, the conflict is resolved simply by going up one directory (and it keeps going until there's no conflict):
```JS
import sum from 'math/sum'
import div from 'deep/math/div'
```
