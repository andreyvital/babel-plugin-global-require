## `babel-plugin-global-require` [![npm version](https://badge.fury.io/js/babel-plugin-global-require.svg)](http://badge.fury.io/js/babel-plugin-global-require)

### Installation
```
npm install --save-dev babel-plugin-global-require
```

Tell the plugin where's your *root* (.babelrc):

```JSON
{
  "plugins": [
    ["global-require", {
      "root": "src"
    }]
  ]
}
```

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

#### Requiring `index.js` by parent folder name is supported!
It is common to require an `index.js` file by the name of its parent directory, for example:

    src
      security
        authorisation
          index.js

Instead of:

```JS
require('./security/authorisation')
```

You'll write:

```JS
require('authorisation')
```

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
