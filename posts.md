---
layout: page
title: Posts
permalink: /posts/
---

<div class="posts-page">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
  <ul>
    {% for post in tag[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: site.cayman-blog.date_format }}</span>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
</div> 