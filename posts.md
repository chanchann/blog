---
layout: page
title: Posts
permalink: /posts/
ref: posts
---

<div class="posts-page">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
  <ul>
    {% assign posts = tag[1] | sort: 'title' %}
    {% for post in posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: site.cayman-blog.date_format }}</span>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
</div> 