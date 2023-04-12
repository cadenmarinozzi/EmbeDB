# EmbeDB

Vector based image and text database

## How it works

EmbeDB uses a vector based approach to store data. This means that the data is stored as a vector of numbers, called an embedding. This allows for fast retrieval of similar data.

## What can you do with it?

-   Similar image search
-   Long term memory
-   Web searching
-   Much more!

## Installation

EmbeDB requires Node.js and Python 3 to be installed.

Install the package using npm:

```
npm install embedb
```

Then, create a `.env` file in the root directory of your project and add the API keys for the models you want to use.

```
HUGGINGFACE_API_KEY=<your api key>
OPENAI_API_KEY=<your api key>
```

## Usage

First, require the module and create a new instance of the database.

```
Memory(model<string, default='huggingface'>)
```

```js
const Memory = require('embedb');

const memory = new Memory();
```

### Inserting data

To memorize text, use the `memorize` method.

```
async Memory.memorize({
    key<string>,
    value<string>,
    model<string, default='huggingface'>
})
```

```js
await memory.memorize({
	key: 'What is my name?',
	value: 'EmbeDB',
});
```

To memorize an image, you must pass in the image path and use an image model such as `resnet50`.

```js
await memory.memorize({
	key: 'Matrix meme',
	value: './matrixMeme.png',
	model: 'resnet50',
});
```

To memorize multiple items, use the `memorizeAll` method.

```
async Memory.memorizeAll([
    {
        key<string>,
        value<string>,
    },
    {
        key<string>,
        value<string>,
    },
], model<string, default='huggingface'>)
```

```js
await memory.memorizeAll([
  {
    key: "What is my name?",
    value: "EmbeDB",
  },
  {
    key: "Who is the president of the United States in 2023?"
    value: "Joe Biden",
  },
]);
```

### Retrieving data

To retrieve the first most similar memory item, use the `recall` method.

```
async Memory.recall(key<string>, n<number> model<string, default='huggingface'>) -> MemoryItem{
    key<string>,
    value<string>,
    similarity<number>,
    prune<function>
}
```

```js
const data = await memory.recall("What's my name?");
```

To retrieve the first n most similar memory items, use the `recall` method with the second parameter as n

```js
const name = await memory.recall("What's my name?", 2);
/*
{
    key: "What is my name?",
    value: "EmbeDB",
    similarity: 0.9999999999999999,
    prune: [Function: prune]
},
{
    key: "What is your name?",
    value: "User",
    similarity: 0.3664122137402344,
    prune: [Function: prune]
}
*/
```

### Deleting data

To delete a memory item, use the `prune` method on a returned memory item from `recall`.

```
MemoryItem.prune()
```

```js
const name = await memory.recall("What's my name?");

await name.prune();
```

### Loading saved data

```
Memory.load(memoryData<object>)
```

To load saved data, use the `load` method.

```js
const fs = require('fs');
await memory.load(JSON.parse(await fs.promises.readFile('./memory.json')));
```

## Embedding Models

### Image Models

-   resnet50

### Text Models

-   huggingface
-   openai
