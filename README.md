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


## Usage
1. Include the neocron package in your app.tsx folder. We highly recommend enforcing that the component only render client-side to avoid client-server mismatches with times and timezones. You can easily do this by using a combination of state variables and useEffect. Make sure that Neocron renders conditionally as well. 

```javascript

import  Neocron from 'neocron'
import 'neocron/dist/src/globals.css'

export function App() {

    const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code runs after mount, indicating we're on the client
    setIsClient(true);
  }, []);

  const [value, setValue] = useState('')
  const defaultCronString = "* * * * 2,3"

  return <Neocron cronString={value} setCronString={setValue} defaultCronString={defaultCronString}/>
}
```
2. Import the shadcn components by updating your tailwind.config.js folder and adding in this path `./node_modules/neocron/dist/src/**/*.{js,css}",` to the content array like so:

```js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/neocron/dist/src/**/*.{js,css}", //adding this to the file makes the shadcn components work
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
```
## Props

| Prop Name            | Description                                                        |
|----------------------|--------------------------------------------------------------------|
| `cronString`         | The prop that will get the selected cron string                    |
| `setCronString`      | A setter to set the cronString                                     |
| `defaultCronString`  | A default cron string to start with                            |
| `disableInput`       | Disable the input and only have drop down selectors                |
| `disableSelectors`   | Disable the selectors and only have the input                      |
| `disableExplainerText`| Disables the schedule explainer text                              |
| `selectorText`       | The text in front of the first selector; can be empty              |


## Styling

NeoCron is styled using [Tailwind CSS](https://tailwindcss.com/), [Radix](https://www.radix-ui.com/) and [Shadcn](https://ui.shadcn.com/). Radix is a component library that provides pre-built UI components such as Selects, Buttons, Alerts and many more. Shadcn styles these base Radix components and provides a plug-and-play experience for developers building front-end components.
