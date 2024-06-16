import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Skill.css';

const skills = [
    { name: "HTML", percent: 80 },
    { name: "CSS", percent: 80 },
    { name: "JavaScript", percent: 75 },
    { name: "React", percent: 75 },
    { name: "Figma", percent: 70 },
    { name: "GitHub", percent: 80 }
];

const Skill = ({ isVisible }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (isVisible && chartRef.current) {
            const canvas = chartRef.current;
            const ctx = canvas.getContext("2d");

            // 캔버스 크기 설정
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;

            // 기존 차트가 있으면 파괴
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // 새 차트 생성
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: skills.map(skill => skill.name),
                    datasets: [{
                        label: 'Skill Proficiency',
                        data: skills.map(skill => skill.percent),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)', // HTML
                            'rgba(54, 162, 235, 0.7)', // CSS
                            'rgba(255, 206, 86, 0.7)', // JavaScript
                            'rgba(75, 192, 192, 0.7)', // React
                            'rgba(153, 102, 255, 0.7)', // Figma
                            'rgba(255, 159, 64, 0.7)'  // GitHub
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                        barPercentage: 0.5,
                        categoryPercentage: 0.5,
                        borderRadius: 5 // 막대 둥근 모서리
                    }]
                },
                options: {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000, // 애니메이션 지속 시간
                        easing: 'easeOutQuint' // 애니메이션 이징 효과
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 100,
                            display: false,
                            grid: {
                                display: false
                            },
                        },
                        y: {
                            display: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 16,
                                    family: 'Arial, sans-serif',
                                    weight: 'bold'
                                },
                                color: '#333'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleFont: {
                                size: 14,
                                family: 'Arial, sans-serif',
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 12,
                                family: 'Arial, sans-serif'
                            },
                            cornerRadius: 4,
                            caretSize: 6,
                            xPadding: 10,
                            yPadding: 10
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: '#000',
                            font: {
                                size: 14,
                                weight: 'bold',
                                family: 'Arial, sans-serif'
                            },
                            formatter: (value) => `${value}%`,
                            offset: -50 // 오른쪽 여백을 더 줌
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }
    }, [isVisible]);

    return (
        <div id="skill-section" className="skill-section">
            <div className="skills-chart">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default Skill;
