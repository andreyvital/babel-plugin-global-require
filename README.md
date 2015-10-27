## `babel-plugin-global-require` [![npm version](https://badge.fury.io/js/babel-plugin-global-require.svg)](http://badge.fury.io/js/babel-plugin-global-require)
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

**node_modules** can be configured with few options: *package.json*, `["module", "module", "module"]` and the path to the *node_modules* directory. Both options `exclude` and `node_modules` are optional.

### What are the benefits?
- You'll use the same require statement from anywhere in your project;
- You'll avoid path hell `../../../../..`;
- You'll write a more concise code.

This plugin is convention based: the alias is always the name of the file. For example:
```
src (root)
  util
    queue
      InMemoryAcknowledgingQueue.js
      PriorityQueue.js
      CallbackQueue.js
      ...
  io
    NuclearEventEmitter.js
  user
    UserActions.js
    UserStore.js
  security
    authorization
      rbac
        Role.js
  ...
```

Then:
```JS
import NuclearEventEmitter from 'NuclearEventEmitter'

// (...)
import UserStore from 'UserStore'

// require
var Role = require('Role')
```

It will translate `'NuclearEventEmitter'` to `src/io/NuclearEventEmitter.js` for you. And the same happens to `UserStore` and `Role`.

### But what about conflicts?
Given the following structure:
```
src
  security
    authorization
      rbac
        hasAccessTo.js
      acl
        hasAccessTo.js
```

You can't require `hasAccessTo.js` only by its name because it would result in a require of undesired file. So for this specific case, the conflict is resolved simply by going up one directory (and it keeps going until there's no conflict):

```JS
import { hasAccessTo as ... } from 'rbac/hasAccessTo'
import { hasAccessTo as ... } from 'acl/hasAccessTo'
```

### Windows and path.resolve and path.join

Now its working.

### MinDeep Option (default = 0)

Some times you need set minimum path deep 

```
src
  security
    authorization
      dropbox
        OAuth2.js
        OAuth1.js
```

For now three is no OAuth1.js or OAuth2.js files in project but when you need more logic and you added new auth service
```
src
  security
    authorization
      google
        OAuth2.js
      dropbox
        OAuth2.js
        OAuth1.js
```

You want to make some logic and no path fixing in future, event if you removed OAuth2 from project you dont need to fix paths

```JS
import { OAuth1 as ... } from 'google/OAuth2'
import { OAuth2 as ... } from 'dropbox/OAuth2'
import { OAuth3 as ... } from 'dropbox/OAuth1'
```
So its still will be valid (minDeep = 1)
```JS
import { OAuth1 as ... } from 'google/OAuth2'
import { OAuth3 as ... } from 'dropbox/OAuth1'
```

