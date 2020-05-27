# TeachDH Test Site

To build a live searchable FAQ as a companion to the second edition of [*Using Digital Humanities in the Classroom*](https://www.bloomsbury.com/uk/using-digital-humanities-in-the-classroom-9781350029750/), a combination of [Jekyll](https://github.com/jekyll/jekyll) and [Create React App](https://github.com/facebook/create-react-app) was used. The React App, located in `teachdh-app-dev/` folder, renders the content and coordinates the fuzzy search and filtering of questions. Jekyll, which is the main app, handles post creation and site building.

## Updating the Site Layout

The main styles for the page are located in `assets/css/site.scss`. This [Sass](https://sass-lang.com/) file has style hooks for all the page elements in the site. Editing it will update page styles.

The layout for the site is located in `_layouts/teachdh.html`. The `{{ content }}` tag will be replaced with the code to bootstrap the React app.

**Important**: Do not edit the files in `app/`. That file is built by Create React App and is not intended to be human-readable or editable. If you need to change the JavaScript portions of the site, such as how questions are formatted or displayed, see "Making Changes to the React App" below.

## Adding Questions

We use Jekyll's [blogging features](https://jekyllrb.com/docs/posts/) to handle posts. To create a post, add a new Markdown file (`.md` extension) or HTML file (`.html` extension) to the `_posts/` directory. The file must be named in the following form:

~~~
YEAR-MONTH-DAY-title.MARKUP
~~~

The dates don't matter for the purposes of this site, but earlier dates will display before later dates, so you can use the date of the post to sort questions on the main page.

## Building the Site

To build the site, run `jekyll build` and upload the contents of the `_site` directory to your desired static host.

**Note**: This site uses a custom plugin and cannot be deployed to GitHub Pages.

## Making Changes to the React App

The React app is housed in `teachdh-app-dev/` and uses the [Yarn](https://yarnpkg.com/) to manage build and packages.

**Important:** Do not edit any of the files in the `app/` directory. This directory is built by Create React App and is not intended to be human-readable.

To get started, after installing Node.js and Yarn, in `teachdh-app-dev/`, run `yarn install` to download the required packages.

To test changes, run `yarn start` to start a test server.

When the app is working as you want, run `yarn deploy` to build an updated version of the app for Jekyll.

## Resources Used

* [How I Use React in Jekyll](https://www.blairanderson.co/2020/create-react-jekyll/)
* [Outputing Markdown from Jekyll Using Hooks](https://humanwhocodes.com/blog/2019/04/jekyll-hooks-output-markdown/)
