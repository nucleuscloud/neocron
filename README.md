# NeoCron

## Introduction

NeoCron is a modern, lightweight cron scheduling react component that is styled using tailwind. It is influenced and built upon [cron-converter](https://github.com/roccivic/cron-converter) project.

## Installation

Make sure that you have these dependencies in your project:
1. react (>=18.2.0)
2. tailwindcss(>=3.3.3)

```bash
npm i neocron
```


# Usage

```javascript

import  Neocron from 'neocron'
import 'neocron/dist/src/globals.css'

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
