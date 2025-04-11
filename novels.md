---
layout: page
title: Novels
permalink: /novels/
ref: novels
---

<div class="novels-page">
{% assign novels = site.novels | sort: 'date' | reverse %}
{% for novel in novels %}
  <div class="novel-item">
    <h2><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h2>
    <div class="novel-meta">
      <span class="novel-date">{{ novel.date | date: site.cayman-blog.date_format }}</span>
      {% if novel.categories %}
      <span class="novel-categories">
        Categories: 
        {% for category in novel.categories %}
          <span class="novel-category">{{ category }}</span>{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      </span>
      {% endif %}
    </div>
    <div class="novel-excerpt">
      {{ novel.excerpt }}
    </div>
    <a href="{{ novel.url | relative_url }}" class="read-more">Read more →</a>
  </div>
{% endfor %}
</div>
