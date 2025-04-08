# The Cayman Blog theme

[![Build Status](https://travis-ci.org/lorepirri/cayman-blog.svg?branch=master)](https://travis-ci.org/lorepirri/cayman-blog) [![Gem Version](https://badge.fury.io/rb/jekyll-theme-cayman-blog.svg)](https://badge.fury.io/rb/jekyll-theme-cayman-blog)

*Cayman Blog is a Jekyll theme for GitHub Pages. It is based on the nice [Cayman theme](https://pages-themes.github.io/cayman/), with blogging features added. You can [preview the theme to see what it looks like](http://lorepirri.github.io/cayman-blog), or even [use it today](#usage).*

<img src="https://raw.githubusercontent.com/lorepirri/cayman-blog/master/thumbnail.png" alt="Thumbnail of cayman-blog" style="max-width:30%; border: 1px solid grey;"/> <img src="https://raw.githubusercontent.com/lorepirri/cayman-blog/master/thumbnail-mobile.gif" alt="Thumbnail of cayman-blog for mobile" style="max-width:30%;"/>

## Netlify CMS

This blog includes Netlify CMS for content management. To use it:

1. Access the admin interface at `/admin` (e.g., https://chanchann.github.io/blog/admin/)
2. Log in with your GitHub account (the one with push access to this repository)
3. Create and edit blog posts through the web interface
4. When you save, the CMS will commit changes to the repository automatically

### Note on Netlify CMS Setup

For Netlify CMS to work properly with GitHub authentication, you need to:

1. Sign up for a Netlify account at [netlify.com](https://netlify.com) if you don't have one
2. Connect your GitHub repository to Netlify
3. Enable Identity service in your Netlify site settings
4. Set up Git Gateway in Netlify to allow CMS access to your repository

For detailed instructions, see the [Netlify CMS docs](https://www.netlifycms.org/docs/github-backend/).

## Install

Cayman Blog Theme has been developed as a Jekyll theme gem for easier use. It is also 100% compatible with GitHub Pages — just with a more involved installation process according to whether you're _running Jekyll v3.3+ and self-hosting_, or if you're *hosting with GitHub Pages*.

## Self hosting

If you're running Jekyll v3.3+ and **self-hosting** you can quickly install the theme as Ruby gem:

1. Add this line to your Jekyll site's Gemfile:

    ```
    gem "jekyll-theme-cayman-blog"
    ```

2. Add this line to your Jekyll site's _config.yml file:

    ```
    theme: jekyll-theme-cayman-blog
    ```

3. Then run Bundler to install the theme gem and dependencies:

    ```
    script/bootstrap
    ```

## Hosting with GitHub Pages

If you're *hosting your blog with GitHub Pages* you'll have to consider this:

:warning: As stated in the official [Jekyll documentation](https://jekyllrb.com/docs/themes/#installing-a-theme):

> If you're publishing your Jekyll site on [GitHub Pages](https://pages.github.com/), note that GitHub Pages supports only some gem-based themes. See [Supported Themes](https://pages.github.com/themes/) in GitHub's documentation to see which themes are supported.

Therefore, this theme, as well as many others, can not be installed in the same way as the ones officially supported by GitHub Pages (e.g. Cayman, Minima), a bit more effort has to be put on.

The easiest way I found to install _Cayman Blog Theme_, is [installing the theme gem](gem-install), and then [converting the gem-based theme to regular theme](https://jekyllrb.com/docs/themes/#converting-gem-based-themes-to-regular-themes).

Alternatively, for new projects, one could fork the whole theme, and keep only the interesting files.


### Gem Install

This method is preferred for existing _Jekyll blogs_, as well as newly created ones. Notice that the files `index.md`, `about.md`, `contact.md` will be overwritten (only `index.md` is really needed, the other two are just placeholders).

1. Install the theme gem: ` $ gem install jekyll-theme-cayman-blog`
3. Run `$ gem env gemdir` to know where the gem was installed
4. Open the folder shown in the output
5. Open the folder `gems`
5. Open the theme folder (e.g. `jekyll-theme-cayman-blog-0.0.5`)
6. Copy all the files into your newly created or existing blog folder    
7. Leave empty `theme` your site's `_config.yml`:

    ```yml
    theme:
    ```
6. Modify `_config.yml`, `about.md`, `contact.md` for your project
7. [Customize the theme](customizing)

### Install as a Fork

1. [Fork the repo](https://github.com/lorepirri/cayman-blog)
2. Clone down the repo with `$ git clone git@github.com:username/reponame.git`
3. Delete the `screenshot.png` and `screenshot-mobile.png` files
3. Empty the `_posts` folder
4. Install bundler and gems with `$ script/bootstrap`
5. Run Jekyll with `$ bundle exec jekyll serve`
6. Modify `_config.yml`, `about.md`, `contact.md`, and `now.md` for your project
7. [Customize the theme](customizing)

## Customizing

### Configuration variables

Cayman Blog will respect the following variables, if set in your site's `_config.yml`:

```yml
title: [The title of your site]
description: [A short description of your site's purpose]
```

Additionally, you may choose to set the following optional variables:

```yml
show_downloads: ["true" or "false" to indicate whether to provide a download URL]
google_analytics: [Your Google Analytics tracking ID]
```

### RSS feeds

To enable RSS feeds and also make visible an RSS feeds button in the footer, the [Jekyll Feed plugin](https://github.com/jekyll/jekyll-feed) must be installed.

Add this line to your site's Gemfile:

```ruby
gem 'jekyll-feed'
```

And then add this line to your site's `_config.yml`:

```yml
plugins:
  - jekyll-feed
```

:warning: If you are using Jekyll < 3.5.0 use the `gems` key instead of `plugins`.

For more information about configuring this plugin, see the official [Jekyll Feed plugin](https://github.com/jekyll/jekyll-feed) page.

### SEO tags

Cayman Blog includes simple SEO tags from [jekyll-social-metatags](https://github.com/lorepirri/jekyll-social-metatags). Have a look at the page for its usage.

The usage is compatible with the plugin [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag), which provides a battle-tested template of crowdsourced best-practices.

To switch to a better SEO tags however, one should install [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag):

1. Add this line to your site's Gemfile:

    ```ruby
    gem 'jekyll-seo-tag'
    ```

2. And then add this line to your site's `_config.yml`:

    ```yml
    plugins:
      - jekyll-seo-tag
    ```

3. Replace with the following, the `<!-- jekyll-seo-tag -->` comment in your site's `default.html`:

      ```liquid
      {% seo %}
      ```

For more information about configuring this plugin, see the official [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag) page.


### Stylesheet

If you'd like to add your own custom styles:

1. Create a file called `/assets/css/style.scss` in your site
2. Add the following content to the top of the file, exactly as shown:
    ```scss
    @import "{{ site.theme }}";
    ```