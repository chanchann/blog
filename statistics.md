---
layout: page
title: Statistics
permalink: /statistics/
ref: statistics
---

<div class="statistics-page">
  <div class="stat-section">
    <h2>Page Views</h2>
    <div class="chart-container">
      <canvas id="pageViewsChart"></canvas>
    </div>
  </div>

  <div class="stat-section">
    <h2>Popular Posts</h2>
    <div class="chart-container">
      <canvas id="popularPostsChart"></canvas>
    </div>
  </div>

  <div class="stat-section">
    <h2>Visitor Locations</h2>
    <div class="chart-container">
      <canvas id="visitorLocationChart"></canvas>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/statistics.js' | relative_url }}"></script> 