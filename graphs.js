import { showUserData, userData } from "./main.js";
import { showProgress, dataForGraph } from "./queries.js";





export async function renderChart() {
    try {
        console.log('Showing userData in graphs.js', userData);
        await showUserData();

        const auditRatioValue = userData.auditRatio;
        const totalUpValue = userData.totalUp / 1000000;
        const totalDownValue = userData.totalDown / 1000000; 
        console.log('Total Up Value:', totalUpValue.toFixed(1));
        console.log('Total Down Value:', totalDownValue.toFixed(1));

        const nameSpace = 'http://www.w3.org/2000/svg';

        const svg = document.createElementNS(nameSpace, 'svg');
        svg.setAttribute('height', `${600}px`); 
        svg.setAttribute('width', `${600}px`); 

        const maxValue = Math.max(Math.ceil(auditRatioValue), totalUpValue, totalDownValue); 
        const chartHeight = 500;
        const barWidth = 40;
        const barHeightTotalUp = (totalUpValue / maxValue) * chartHeight;
        const barHeightTotalDown = (totalDownValue / maxValue) * chartHeight;
        const barHeightAuditRatio = (auditRatioValue / maxValue) * chartHeight;
        console.log('Bar Height Total Up:', barHeightTotalUp);
        console.log('Bar Height Total Down:', barHeightTotalDown);

        
        for (let i = 0; i <= 10; i++) { 
            const value = (maxValue / 10) * i;
            const textElement = document.createElementNS(nameSpace, 'text');
            textElement.textContent = `${value.toFixed(1)} MB`; 
            textElement.setAttribute('x', 30);
            textElement.setAttribute('y', chartHeight - (chartHeight / 10) * i);
            svg.appendChild(textElement);

           
            const lineElement = document.createElementNS(nameSpace, 'line');
            lineElement.setAttribute('x1', '90');
            lineElement.setAttribute('y1', chartHeight - (chartHeight / 10) * i);
            lineElement.setAttribute('x2', '520'); 
            lineElement.setAttribute('y2', chartHeight - (chartHeight / 10) * i);
            lineElement.setAttribute('stroke', 'gray');
            svg.appendChild(lineElement);
        }

        const rectTotalUp = document.createElementNS(nameSpace, 'rect');
        const rectTotalDown = document.createElementNS(nameSpace, 'rect');
        const rectAuditRatio = document.createElementNS(nameSpace, 'rect');

        rectTotalUp.setAttribute('x', '150');
        rectTotalUp.setAttribute('y', chartHeight - barHeightTotalUp);
        rectTotalUp.setAttribute('width', barWidth);
        rectTotalUp.setAttribute('height', barHeightTotalUp);
        rectTotalUp.setAttribute('fill', 'purple');

        rectTotalDown.setAttribute('x', '250');
        rectTotalDown.setAttribute('y', chartHeight - barHeightTotalDown);
        rectTotalDown.setAttribute('width', barWidth);
        rectTotalDown.setAttribute('height', barHeightTotalDown);
        rectTotalDown.setAttribute('fill', 'red');

        rectAuditRatio.setAttribute('x', '350'); 
        rectAuditRatio.setAttribute('y', chartHeight - barHeightAuditRatio);
        rectAuditRatio.setAttribute('width', barWidth);
        rectAuditRatio.setAttribute('height', barHeightAuditRatio);
        rectAuditRatio.setAttribute('fill', 'blue');

        svg.appendChild(rectTotalUp);
        svg.appendChild(rectTotalDown);
        svg.appendChild(rectAuditRatio);

        
        const textTotalUp = document.createElementNS(nameSpace, 'text');
        textTotalUp.textContent = `Done: ${totalUpValue.toFixed(1)} MB`; 
        textTotalUp.setAttribute('x', '190');
        textTotalUp.setAttribute('y', chartHeight - barHeightTotalUp + 20);
        textTotalUp.setAttribute('fill', 'purple');
        textTotalUp.setAttribute('font-weight', 'bold'); 
        svg.appendChild(textTotalUp);

        const textTotalDown = document.createElementNS(nameSpace, 'text');
        textTotalDown.textContent = `Received: ${totalDownValue.toFixed(1)} MB`; 
        textTotalDown.setAttribute('x', '290');
        textTotalDown.setAttribute('y', chartHeight - barHeightTotalDown + 20);
        textTotalDown.setAttribute('fill', 'red');
        textTotalDown.setAttribute('font-weight', 'bold'); 
        svg.appendChild(textTotalDown);

        const textAuditRatio = document.createElementNS(nameSpace, 'text');
        textAuditRatio.textContent = `Audit Ratio: ${auditRatioValue.toFixed(1)} MB`; 
        textAuditRatio.setAttribute('x', '390');
        textAuditRatio.setAttribute('y', chartHeight - barHeightAuditRatio + 20);
        textAuditRatio.setAttribute('fill', 'blue');
        textAuditRatio.setAttribute('font-weight', 'bold');
        svg.appendChild(textAuditRatio);

        const chartContainer = document.getElementById('barChart');
        chartContainer.appendChild(svg);
        
    } catch (error) {
        console.error('Error', error.message);
    }
}
export async function renderLineChart() {
    await showProgress();
    console.log("DataForGraph in graphs.js", dataForGraph);
  
    const xps = dataForGraph.map((item) => item.xp);
    const totalXP = xps.reduce((acc, xp) => acc + xp, 0);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const graphContainer = document.getElementById('lineChart');
    const graphWidth = 800;
    const graphHeight = 400;
    const marginLeft = 50;
    const marginBottom = 50;
    const marginTop = 35;
    const yAxisLabelCount = 4;
    const maxXP = Math.max(...xps);
  
    const yScale = (graphHeight - marginBottom - marginTop) / (maxXP - xps[0]);
    let path = `<path d="M${marginLeft},${graphHeight - marginBottom} `;
    let xpResult = 0;
  
    for (let i = 0; i < dataForGraph.length; i++) {
      xpResult += xps[i];
      console.log(xpResult);
      const y = graphHeight - marginBottom - (xpResult - xps[0]) * yScale;
      const x = marginLeft + i * ((graphWidth - marginLeft) / (dataForGraph.length - 1));
      path += `L${x},${y} `;
    }
  
    path += `" fill="none" fill-opacity="1" stroke="black" stroke-width="2"></path>`;
    svg.innerHTML = path;

  
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', marginLeft);
    xAxis.setAttribute('y1', graphHeight - marginBottom);
    xAxis.setAttribute('x2', graphWidth);
    xAxis.setAttribute('y2', graphHeight - marginBottom);
    xAxis.setAttribute('stroke', 'black');
    svg.appendChild(xAxis);
  
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', marginLeft);
    yAxis.setAttribute('y1', marginTop);
    yAxis.setAttribute('x2', marginLeft);
    yAxis.setAttribute('y2', graphHeight - marginBottom);
    yAxis.setAttribute('stroke', 'black');
    svg.appendChild(yAxis);
  
    const yAxisLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let i = 0; i < yAxisLabelCount; i++) {
      const y = graphHeight - marginBottom - (i / (yAxisLabelCount - 1)) * (graphHeight - marginBottom - marginTop);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', marginLeft - 10);
      label.setAttribute('y', y);
      label.setAttribute('fill', '#2D3652');
      label.setAttribute('font-family', 'Montserrat');
      label.setAttribute('font-size', '12px');
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('alignment-baseline', 'middle');
      if (i === 0) {
        label.textContent = '0';
      } else {
        label.textContent = (totalXP / 1000 * (i / (yAxisLabelCount - 1))).toFixed();
      }
      yAxisLabels.appendChild(label);
    }
    svg.appendChild(yAxisLabels);
  
    const xAxisLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    dataForGraph.forEach((element, i) => {
      const date = new Date(Date.parse(element.updatedAt)).toLocaleString('us-US', {
        year: 'numeric',
        month: 'numeric',
      });
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xAxis.setAttribute('x', marginLeft + i * ((graphWidth - marginLeft) / dataForGraph.length));
      xAxis.setAttribute('y', graphHeight - marginBottom + 20);
      xAxis.setAttribute('fill', '#2D3652');
      xAxis.setAttribute('font-family', 'Montserrat');
      xAxis.setAttribute('font-size', '12px');
      xAxis.setAttribute('text-anchor', 'middle');
      xAxis.textContent = date;
      xAxisLabels.appendChild(xAxis);
    });
    svg.appendChild(xAxisLabels);
  
    svg.setAttribute('width', graphWidth);
    svg.setAttribute('height', graphHeight);
    graphContainer.appendChild(svg);
  }
  