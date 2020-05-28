# TeachDH Test Site

To build a live searchable FAQ as a companion to the second edition of [*Using Digital Humanities in the Classroom*](https://www.bloomsbury.com/uk/using-digital-humanities-in-the-classroom-9781350029750/), a combination of [Jekyll](https://github.com/jekyll/jekyll) and [Create React App](https://github.com/facebook/create-react-app) was used. The React App, located in `teachdh-app-dev/` folder, renders the content and coordinates the fuzzy search and filtering of questions. Jekyll, which is the main app, handles post creation and site building.

## Updating the Site Layout

The main styles for the page are located in `assets/css/site.scss`. This [Sass](https://sass-lang.com/) file has style hooks for all the page elements in the site. Editing it will update page styles.

The layout for the site is located in `_layouts/teachdh.html`. The `{{ content }}` tag will be replaced with the code to bootstrap the React app.

## Adding Questions

We use Jekyll's [blogging features](https://jekyllrb.com/docs/posts/) to handle posts. To create a post, add a new Markdown file (`.md` extension) or HTML file (`.html` extension) to the `_posts/` directory. The file must be named in the following form:

~~~
YEAR-MONTH-DAY-title.MARKUP
~~~

The dates don't matter for the purposes of this site, but earlier dates will display before later dates, so you can use the date of the post to sort questions on the main page.

## Building the Site

To build the site, run `jekyll build` and upload the contents of the `_site` directory to your desired static host.
