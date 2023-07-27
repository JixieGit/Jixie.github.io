import { showUserData, userData } from "./main.js";

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
        const barSpacing = 10;
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
