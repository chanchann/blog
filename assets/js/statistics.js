class BlogStatistics {
  constructor() {
    this.pageViewsChart = null;
    this.popularPostsChart = null;
    this.visitorLocationChart = null;
    this.initializeCharts();
  }

  async initializeCharts() {
    // Initialize charts with loading state
    this.initPageViewsChart();
    this.initPopularPostsChart();
    this.initVisitorLocationChart();

    // Fetch and update data
    await this.updateAllCharts();
  }

  initPageViewsChart() {
    const ctx = document.getElementById('pageViewsChart').getContext('2d');
    this.pageViewsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getLast7Days(),
        datasets: [{
          label: 'Daily Page Views',
          data: new Array(7).fill(0),
          borderColor: '#2a7ae2',
          tension: 0.1,
          fill: true,
          backgroundColor: 'rgba(42, 122, 226, 0.1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Daily Page Views (Last 7 Days)'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  initPopularPostsChart() {
    const ctx = document.getElementById('popularPostsChart').getContext('2d');
    this.popularPostsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Views',
          data: [],
          backgroundColor: '#2a7ae2'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Most Popular Posts'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  initVisitorLocationChart() {
    const ctx = document.getElementById('visitorLocationChart').getContext('2d');
    this.visitorLocationChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#2a7ae2',
            '#36A2EB',
            '#4BC0C0',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Visitor Locations'
          }
        }
      }
    });
  }

  getLast7Days() {
    return Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString();
    });
  }

  async updateAllCharts() {
    try {
      // 使用 Google Analytics Data API 获取数据
      const pageViews = await this.fetchPageViews();
      const popularPosts = await this.fetchPopularPosts();
      const visitorLocations = await this.fetchVisitorLocations();

      this.updatePageViewsChart(pageViews);
      this.updatePopularPostsChart(popularPosts);
      this.updateVisitorLocationChart(visitorLocations);
    } catch (error) {
      console.error('Error updating charts:', error);
      this.showError();
    }
  }

  async fetchPageViews() {
    // 这里将来添加实际的 GA4 API 调用
    // 目前返回示例数据
    return Array.from({length: 7}, () => Math.floor(Math.random() * 100));
  }

  async fetchPopularPosts() {
    // 这里将来添加实际的 GA4 API 调用
    // 目前返回示例数据
    return {
      labels: ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'],
      data: [100, 80, 60, 40, 20]
    };
  }

  async fetchVisitorLocations() {
    // 这里将来添加实际的 GA4 API 调用
    // 目前返回示例数据
    return {
      labels: ['China', 'US', 'Japan', 'Germany', 'UK'],
      data: [50, 30, 20, 10, 5]
    };
  }

  updatePageViewsChart(data) {
    this.pageViewsChart.data.datasets[0].data = data;
    this.pageViewsChart.update();
  }

  updatePopularPostsChart(data) {
    this.popularPostsChart.data.labels = data.labels;
    this.popularPostsChart.data.datasets[0].data = data.data;
    this.popularPostsChart.update();
  }

  updateVisitorLocationChart(data) {
    this.visitorLocationChart.data.labels = data.labels;
    this.visitorLocationChart.data.datasets[0].data = data.data;
    this.visitorLocationChart.update();
  }

  showError() {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => {
      container.innerHTML = '<div class="error-message">Failed to load statistics data</div>';
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BlogStatistics();
}); 