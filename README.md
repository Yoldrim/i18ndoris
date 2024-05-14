# i18ndoris
Internationalization for js made easy! Mostly plug and play, and should work with most js/ts projects. This package can handle both general translations, and context specific.

### Installation
1. `yarn add i18ndoris` or `npm install i18ndoris`
2. Create a folder for your translations, and add files for every language you want to translate to. `./translations/en.json` as an example.
3. At any root in your project, initialize the package with `init`. This is what it would look like in the `index.js` file of a React project. 
```js
...
import { init } from 'i18njs';

const en = require('./translations/en.json');
const sv = require('./translations/sv.json');

init('en', {en, sv});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```


### Add your first translation
Following is an example in React. We will add some translations, and then switch between two locales. This approach should work just as well with other frameworks. 

Let's add our first translations!
```js
function App() {
  return (
    <div>
      <Text>{t('Test string')}</Text>
      <Text>{ct('Landing Page', 'Another test string')}</Text>
      <div style={{
          width: 100, 
          height: 40, 
          backgroundColor: '#000'
      }} onClick={() => {
        setTranslations('sv');
      }}/>
    </div>
  );
}
```
To detect our added messages, we need to run a script which parses the messages and adds them to our locales so that they can be translated. The easiest way to do this is to add a script to our `package.json` file.
```json
"scripts": {
    ...
    "translation": "npx i18ndoris-update <root of scan> <path to our locales dir>"
    ...
  },
```
After running this script, our locale files should be populated with the newly added messages. It should look something like this:

```json
[
  {
    "id": "landing_page.another_test_string",
    "defaultMessage": "Another test string"
  },
  {
    "id": "test_string",
    "defaultMessage": "A test string"
  }
]
```

Perfect! Let's translate the strings and test it out.

In React you need to trigger a re-render for the translation changes to take effect, and since our test component is pretty barebones we will have to force a re-render.

```js
function App() {
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);
  return (
    <div>
      <Text>{t('Test string')}</Text>
      <Text>{ct('Landing Page', 'Another test string')}</Text>
      <div style={{
          width: 100, 
          height: 40, 
          backgroundColor: '#000'
      }} onClick={() => {
        setTranslations('sv');
        forceUpdate();
      }}/>
    </div>
  );
}
```

If you've done everything right, it should now look something like this!
![](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWNvamQ3Z3V6ZXF2YTBzejBsN21uOW85cmVibnAyaG15Z2VmbThzeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NDbRQNIOj7ejpm2ikj/giphy.gif)
