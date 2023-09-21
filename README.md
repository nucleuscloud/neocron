# NeoCron

## Introduction

NeoCron is a modern, lightweight cron scheduling react component that is styled using tailwind. It is influenced and built upon [cron-converter](https://github.com/roccivic/cron-converter) project.

## Getting started

1. Clone down the repo
2. install all dependencies using NPM
3. run npm run dev to run the application locally on port localhost:3000


# Usage

```javascript

import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'

export function App() {
  const [value, setValue] = useState('30 5 * * 1,6')

  return <Neocron defaultValue={value} setValue={setValue} />
}
```

# Props

| Prop Name            | Description                                                        |
|----------------------|--------------------------------------------------------------------|
| `setCronString`      | The cron string itself                                             |
| `defaultValue`       | If you want to specify a default cron string to start with          |
| `disableInput`       | Disable the input and only have drop down selectors                |
| `disableSelectors`   | Disable the selectors and only have the input                      |
| `disableExplainerText`| Disables the schedule explainer text                               |
| `selectorText`       | The text in front of the first selector; can be empty              |
| `inputText`          | The text above the input                                           |


## Styling

NeoCron is styled using [Tailwind CSS](https://tailwindcss.com/), [Radix](https://www.radix-ui.com/) and [Shadcn](https://ui.shadcn.com/). Radix is a component library that provides pre-built UI components such as Selects, Buttons, Alerts and many more. Shadcn styles these base Radix components and provides a plug-and-play experience for developers building front-end components.
