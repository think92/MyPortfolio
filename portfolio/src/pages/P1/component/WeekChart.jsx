import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const dataLabelPlugin = {
    id: "dataLabelPlugin",
    afterDatasetDraw: (chart, args) => {
        const { ctx } = chart;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#444";

        const dataset = chart.data.datasets[args.index];
        const scaleFactor = chart.scales.y.max * 0.95;
        dataset.data.forEach((value, index) => {
            const meta = chart.getDatasetMeta(args.index);
            const bar = meta.data[index];
            const yPos = value >= scaleFactor ? bar.y + 20 : bar.y - 5;
            ctx.fillText(value, bar.x, yPos);
        });
    },
};

function applyGradient(chart, colorStart, colorEnd) {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
    );
    gradient.addColorStop(0, colorEnd);
    gradient.addColorStop(1, colorStart);
    return gradient;
}

const baseOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
            enabled: true,
        },
        datalabels: {
            display: true, // datalabels 숨김
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                drawBorder: false,
                display: false,
            },
            ticks: {
                display: false, // x축 눈금 숨김
            },
        },
        y: {
            display: true,
            grid: {
                display: false,
            },
            ticks: {
                display: false, // y축 눈금 숨김
            },
        },
    },
    elements: {
        bar: {
            borderRadius: 20,
        },
    },
};

const regularOptions = {
    ...baseOptions,
    plugins: {
        ...baseOptions.plugins,
        datalabels: {
            display: true, // datalabels
            color: '#555',
            font: {
              weight: 'bold'
            },
        },
        dataLabelPlugin,
    },
    animation: {
        onComplete: (animation) => {
            const chart = animation.chart;
            chart.data.datasets[0].backgroundColor = applyGradient(
                chart,
                "#A7EAC6",
                "#B2E2BF"
            );
            chart.update();
        },
    },
};

const premiumOptions = {
    ...baseOptions,
    plugins: {
        ...baseOptions.plugins,
        datalabels: {
          display: true, // datalabels
          color: '#555',
          font: {
            weight: 'bold'
          },
      },
        dataLabelPlugin,
    },
    animation: {
        onComplete: (animation) => {
            const chart = animation.chart;
            chart.data.datasets[0].backgroundColor = applyGradient(
                chart,
                "#FFA1A1",
                "#FFC1C1"
            );
            chart.update();
        },
    },
};

const RegularSignupChart = ({ data }) => (
    <Bar data={data} options={regularOptions} />
);
const PremiumSignupChart = ({ data }) => (
    <Bar data={data} options={premiumOptions} />
);

const regularData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
        {
            label: "신규 가입자 수",
            data: [5, 9, 3, 1, 3, 7, 4],
        },
    ],
};

const premiumData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
        {
            label: "프리미엄 가입자 수",
            data: [3, 10, 3, 1, 1, 1, 12],
        },
    ],
};

export { RegularSignupChart, PremiumSignupChart };
