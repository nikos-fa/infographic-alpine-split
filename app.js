/*
  app.js
  This file contains all JavaScript logic for the infographic using Alpine.js and Chart.js.
  It includes reactive data, chart setup, slider control, and theme toggling.
*/

function themeToggle() {
  return {
    isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  };
}

// Alpine.js Root Component Scope
function infographicData() {
  return {
    // Data model for sliders
    discoverTime: 20,
    connectTime: 15,
    coCreateTime: 40,
    reinforceTime: 15,
    bufferTime: 0,
    totalLessonTime: 90,
    timeAllocationChart: null,
    updateTimeout: null,

    // Palette for chart
    palette: {
      orange: '#FF5733',
      yellow: '#F1C40F',
      green: '#33FF57',
      pink: '#FF33A1',
      purple: '#8A2BE2',
      lightGray: '#F3F4F6',
      blue: '#3357FF'
    },

    // Tooltip handler for wrapping labels
    tooltipTitleCallback(tooltipItems) {
      const item = tooltipItems[0];
      let label = item.chart.data.labels[item.dataIndex];
      return Array.isArray(label) ? label.join(' ') : label;
    },

    wrapLabel(label) {
      const maxLength = 16;
      if (label.length <= maxLength) return label;
      const words = label.split(' ');
      const lines = [];
      let currentLine = '';
      for (const word of words) {
        if ((currentLine + ' ' + word).length > maxLength && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    },

    // Computed total
    get currentTotalTime() {
      return this.discoverTime + this.connectTime + this.coCreateTime + this.reinforceTime + this.bufferTime;
    },

    // Update chart when sliders change
    updateTimeAllocationChart() {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        if (this.timeAllocationChart) {
          this.timeAllocationChart.data.datasets[0].data = [
            this.discoverTime,
            this.connectTime,
            this.coCreateTime,
            this.reinforceTime,
            this.bufferTime
          ];
          this.timeAllocationChart.update();
        }
      }, 50);
    },

    // Initialize main chart
    initChart($refs) {
      const ctx = $refs.timeAllocationCanvas.getContext('2d');
      this.timeAllocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Phase 1: Discover',
            'Phase 2: Connect',
            'Phase 3: Co-Create',
            'Phase 4: Reinforce',
            '5. Buffer/Flex'
          ],
          datasets: [{
            label: 'Time Allocation (minutes)',
            data: [
              this.discoverTime,
              this.connectTime,
              this.coCreateTime,
              this.reinforceTime,
              this.bufferTime
            ],
            backgroundColor: [
              this.palette.orange,
              this.palette.yellow,
              this.palette.green,
              this.palette.pink,
              this.palette.purple
            ],
            borderColor: this.palette.lightGray,
            borderWidth: 4,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                title: this.tooltipTitleCallback,
                label: (ctx) => `${ctx.label}: ${ctx.raw} min`
              }
            }
          }
        }
      });

      // Setup Alpine watchers after chart is initialized
      this.$watch('discoverTime', () => this.updateTimeAllocationChart());
      this.$watch('connectTime', () => this.updateTimeAllocationChart());
      this.$watch('coCreateTime', () => this.updateTimeAllocationChart());
      this.$watch('reinforceTime', () => this.updateTimeAllocationChart());
      this.$watch('bufferTime', () => this.updateTimeAllocationChart());
    }
  };
}
