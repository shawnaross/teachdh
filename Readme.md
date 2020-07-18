# TeachDH Test Site

To build a live searchable FAQ as a companion to the second edition of [*Using Digital Humanities in the Classroom*](https://www.bloomsbury.com/uk/using-digital-humanities-in-the-classroom-9781350029750/), [Jekyll](https://github.com/jekyll/jekyll) and was used.

## Getting Started

To develop this site, you will need Ruby and Bundler installed. Install ruby for your system, as you see fit. Note macOS ships with an out-dated version of Ruby, so you will need to use something like [Homebrew](https://brew.sh/) to install it.

With Ruby installed, run `gem install bundler` to install the software we need to build the site.

Once Ruby and Bundler are working, run `bundle install` in the directory you cloned from GitHub and you should have a working copy of the site.

## Updating the Site Layout

The main styles for the page are located in `assets/css/site.scss`. This is [Sass](https://sass-lang.com/) file and will update page styles.

The layout for the site is located in `_layouts/teachdh.html`. The `{{ content }}` tag will be replaced with the questions. Jekyll will process [Liquid](https://jekyllrb.com/docs/liquid/) tags in this file.

The site is currently configured to use [Tachyons](http://tachyons.io/) for CSS. It is a functional CSS framework that is very simple to work with.

## Adding Questions

We use Jekyll's [blogging features](https://jekyllrb.com/docs/posts/) to handle questions. To create a post, add a new Markdown file (`.md` extension) or HTML file (`.html` extension) to the `_posts/` directory. The file must be named in the following form:

~~~
YEAR-MONTH-DAY-TITLE.MARKUP
~~~

The dates don't matter for the purposes of this site, but earlier dates will display before later dates, so you can use the date of the post to sort questions on the main page. `TITLE` can be anything in this context. It's easier to set the title in YAML front matter of the post (see an example below).

Here's a sample Markdown question file:

~~~markdown
---
title: "Is This a Question?"
categories:
  - Chapter 1
  - FAQ
---
This is the answer to the above question.

It is a question!
~~~
In the above example, two categories are defined: `FAQ` and `Chapter 1`. The site will generate the overall list of categories based on each question's, so you may add as many categories as you wish.

`categories`, above, is an example of a [YAML sequence](https://www.tutorialspoint.com/yaml/yaml_sequence_styles.htm). Each entry in the sequence is on a new line, indented and prepended with a `-`.


## Testing the Site

Run `bundle exec jekyll serve` to start a development server. It will run on [http://localhost:4000](http://localhost:4000).

## Building the Site

### Basic Mode

To build the site, run `bundle exec jekyll build` and upload the contents of the `_site` directory to your desired static host.

Or, push to a GitHub repository and [the repository's publishing source must be set to `master`](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source).

### Advanced Mode

If you would like to compress assets and HTML files and generally build a smaller, more performant version of the site, you have to have [Node.js](https://nodejs.org/en/) installed.

When you do, run `npm install` in the directory to install the required libraries.

Then, instead of running `bundle exec jekyll build` as above, run `bundle exec rake build` to build the site and upload the contents of `_site` to your desired static host.

The Rake file will also deploy to the `gh-pages` branch for GitHub Pages using `bundle exec rake deploy`.

For deployment to GitHub Pages to work, [the repository's publishing source must be set to `gh-pages`](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source).
