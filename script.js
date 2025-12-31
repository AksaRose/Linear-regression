const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const slopeSlider = document.getElementById('slope');
const interceptSlider = document.getElementById('intercept');
const slopeValue = document.getElementById('slope-value');
const interceptValue = document.getElementById('intercept-value');
const mseDisplay = document.getElementById('mse');
const sseDisplay = document.getElementById('sse');
const equationDisplay = document.getElementById('equation');
const resetBtn = document.getElementById('reset-btn');
const xHeaderInput = document.getElementById('x-header');
const yHeaderInput = document.getElementById('y-header');
const xHeaderDisplay = document.getElementById('x-header-display');
const yHeaderDisplay = document.getElementById('y-header-display');
const tableBody = document.getElementById('table-body');
const addRowBtn = document.getElementById('add-row-btn');
const trainBtn = document.getElementById('train-btn');
const stopBtn = document.getElementById('stop-btn');
const epochsInput = document.getElementById('epochs');
const learningRateInput = document.getElementById('learning-rate');
const trainingStatus = document.getElementById('training-status');

// Training state
let isTraining = false;
let trainingModel = null;
let shouldStopTraining = false;

// Canvas setup
const padding = 40;
const width = 800;
const height = 600;
canvas.width = width;
canvas.height = height;

// Data points
let points = [];

// Line parameters
let slope = 0;
let intercept = 0;

// Coordinate system: canvas coordinates to graph coordinates
function canvasToGraph(x, y) {
    const graphX = (x - padding) / (width - 2 * padding) * 20 - 10;
    const graphY = 10 - (y - padding) / (height - 2 * padding) * 20;
    return { x: graphX, y: graphY };
}

function graphToCanvas(graphX, graphY) {
    const x = ((graphX + 10) / 20) * (width - 2 * padding) + padding;
    const y = ((10 - graphY) / 20) * (height - 2 * padding) + padding;
    return { x, y };
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 20; i++) {
        const x = padding + (i / 20) * (width - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 20; i++) {
        const y = padding + (i / 20) * (height - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = -10; i <= 10; i += 2) {
        const pos = graphToCanvas(i, 0);
        ctx.fillText(i.toString(), pos.x, height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = -10; i <= 10; i += 2) {
        const pos = graphToCanvas(0, i);
        ctx.fillText(i.toString(), padding - 10, pos.y + 4);
    }
}

// Draw the regression line
function drawLine() {
    if (points.length === 0) return;
    
    // Calculate line endpoints in graph coordinates
    const x1 = -10;
    const y1 = slope * x1 + intercept;
    const x2 = 10;
    const y2 = slope * x2 + intercept;
    
    // Convert to canvas coordinates
    const start = graphToCanvas(x1, y1);
    const end = graphToCanvas(x2, y2);
    
    // Draw the line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

// Draw distance lines from points to the regression line
function drawDistances() {
    if (points.length === 0) return;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    points.forEach(point => {
        // Calculate the point on the line closest to this point
        // For a line y = mx + b and point (x0, y0):
        // The closest point on the line is where the perpendicular from the point meets the line
        // x = (x0 + m*(y0 - b)) / (1 + m^2)
        // y = m*x + b
        
        const x0 = point.x;
        const y0 = point.y;
        
        // Handle near-vertical line case (slope is very large)
        if (Math.abs(slope) > 100) {
            // For near-vertical lines, use x = -b/m (x-intercept)
            const lineX = -intercept / slope;
            const closestX = lineX;
            const closestY = y0;
            const pointCanvas = graphToCanvas(x0, y0);
            const closestCanvas = graphToCanvas(closestX, closestY);
            ctx.beginPath();
            ctx.moveTo(pointCanvas.x, pointCanvas.y);
            ctx.lineTo(closestCanvas.x, closestCanvas.y);
            ctx.stroke();
        } else {
            // For non-vertical lines: find closest point using perpendicular distance
            const closestX = (x0 + slope * (y0 - intercept)) / (1 + slope * slope);
            const closestY = slope * closestX + intercept;
            
            const pointCanvas = graphToCanvas(x0, y0);
            const closestCanvas = graphToCanvas(closestX, closestY);
            
            ctx.beginPath();
            ctx.moveTo(pointCanvas.x, pointCanvas.y);
            ctx.lineTo(closestCanvas.x, closestCanvas.y);
            ctx.stroke();
        }
    });
    
    ctx.setLineDash([]);
}

// Draw points
function drawPoints() {
    points.forEach(point => {
        const pos = graphToCanvas(point.x, point.y);
        
        // Draw point
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Calculate loss metrics
function calculateLoss() {
    if (points.length === 0) {
        return { mse: 0, sse: 0 };
    }
    
    let sse = 0;
    
    points.forEach(point => {
        const predictedY = slope * point.x + intercept;
        const error = point.y - predictedY;
        sse += error * error;
    });
    
    const mse = sse / points.length;
    
    return { mse, sse };
}

// Update line from training
function updateLineFromTraining(m, b) {
    slope = m;
    intercept = b;
    slopeSlider.value = Math.max(-5, Math.min(5, m));
    interceptSlider.value = Math.max(-10, Math.min(10, b));
    slopeValue.textContent = m.toFixed(2);
    interceptValue.textContent = b.toFixed(2);
    draw();
}

// Update display
function updateDisplay() {
    const { mse, sse } = calculateLoss();
    mseDisplay.textContent = mse.toFixed(2);
    sseDisplay.textContent = sse.toFixed(2);
    equationDisplay.textContent = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    
    if (points.length > 0) {
        drawDistances();
        drawLine();
    }
    
    drawPoints();
    updateDisplay();
}

// Update points from table
function updatePointsFromTable() {
    points = [];
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const xInput = row.querySelector('.x-input');
        const yInput = row.querySelector('.y-input');
        
        if (xInput && yInput) {
            const x = parseFloat(xInput.value);
            const y = parseFloat(yInput.value);
            
            if (!isNaN(x) && !isNaN(y)) {
                points.push({ x, y });
            }
        }
    });
    
    draw();
}

// Add new row to table
function addRow() {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="number" class="x-input" step="any" placeholder="x"></td>
        <td><input type="number" class="y-input" step="any" placeholder="y"></td>
        <td><button class="delete-btn" onclick="deleteRow(this)">Del</button></td>
    `;
    tableBody.appendChild(row);
    
    // Add event listeners to new inputs
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePointsFromTable);
    });
}

// Delete row from table
function deleteRow(btn) {
    const row = btn.closest('tr');
    row.remove();
    updatePointsFromTable();
}

// Update header displays
function updateHeaders() {
    xHeaderDisplay.textContent = xHeaderInput.value || 'X';
    yHeaderDisplay.textContent = yHeaderInput.value || 'Y';
}

// Event listeners
xHeaderInput.addEventListener('input', updateHeaders);
yHeaderInput.addEventListener('input', updateHeaders);

// Add event listeners to existing inputs
tableBody.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updatePointsFromTable);
});

addRowBtn.addEventListener('click', addRow);

slopeSlider.addEventListener('input', (e) => {
    slope = parseFloat(e.target.value);
    slopeValue.textContent = slope.toFixed(1);
    draw();
});

interceptSlider.addEventListener('input', (e) => {
    intercept = parseFloat(e.target.value);
    interceptValue.textContent = intercept.toFixed(1);
    draw();
});

resetBtn.addEventListener('click', () => {
    points = [];
    slope = 0;
    intercept = 0;
    slopeSlider.value = 0;
    interceptSlider.value = 0;
    slopeValue.textContent = '0.0';
    interceptValue.textContent = '0.0';
    
    // Reset table to one empty row
    tableBody.innerHTML = `
        <tr>
            <td><input type="number" class="x-input" step="any" placeholder="x"></td>
            <td><input type="number" class="y-input" step="any" placeholder="y"></td>
            <td><button class="delete-btn" onclick="deleteRow(this)">Del</button></td>
        </tr>
    `;
    
    // Re-add event listeners
    tableBody.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updatePointsFromTable);
    });
    
    // Reset headers
    xHeaderInput.value = 'X';
    yHeaderInput.value = 'Y';
    updateHeaders();
    
    draw();
});

// Train model with TensorFlow.js
async function trainModel() {
    if (points.length < 2) {
        trainingStatus.textContent = 'Error: Need at least 2 data points to train';
        trainingStatus.style.color = '#ff6b6b';
        return;
    }

    if (isTraining) {
        return;
    }

    isTraining = true;
    shouldStopTraining = false;
    trainBtn.disabled = true;
    stopBtn.style.display = 'block';
    trainingStatus.textContent = 'Initializing model...';
    trainingStatus.style.color = '#667eea';

    try {
        // Prepare data
        const xData = points.map(p => p.x);
        const yData = points.map(p => p.y);
        
        // Normalize data for better training
        const xMin = Math.min(...xData);
        const xMax = Math.max(...xData);
        const yMin = Math.min(...yData);
        const yMax = Math.max(...yData);
        const xRange = xMax - xMin || 1;
        const yRange = yMax - yMin || 1;
        
        const normalizedX = xData.map(x => (x - xMin) / xRange);
        const normalizedY = yData.map(y => (y - yMin) / yRange);

        // Create model
        const model = tf.sequential({
            layers: [tf.layers.dense({inputShape: [1], units: 1, useBias: true})]
        });

        const learningRate = parseFloat(learningRateInput.value);
        const epochs = parseInt(epochsInput.value);

        // Initialize weights from current slope and intercept
        // Convert current m and b to normalized space
        // y = m*x + b in original space
        // y_norm = (m*x + b - yMin) / yRange
        // y_norm = m * (x_norm * xRange + xMin) / yRange + (b - yMin) / yRange
        // y_norm = (m * xRange / yRange) * x_norm + (m * xMin + b - yMin) / yRange
        const mNormalized = slope * (xRange / yRange);
        const bNormalized = (slope * xMin + intercept - yMin) / yRange;
        
        // Set initial weights using tensors
        const kernel = tf.tensor2d([[mNormalized]], [1, 1]);
        const bias = tf.tensor1d([bNormalized]);
        model.setWeights([kernel, bias]);
        
        // Dispose temporary tensors (they're copied into the model)
        kernel.dispose();
        bias.dispose();

        // Compile model
        model.compile({
            optimizer: tf.train.sgd(learningRate),
            loss: 'meanSquaredError'
        });

        trainingModel = model;
        
        trainingStatus.textContent = `Starting from m=${slope.toFixed(2)}, b=${intercept.toFixed(2)}...`;

        // Prepare tensors
        const xs = tf.tensor2d(normalizedX, [normalizedX.length, 1]);
        const ys = tf.tensor2d(normalizedY, [normalizedY.length, 1]);

        let currentEpoch = 0;

        // Train model with real-time updates
        await model.fit(xs, ys, {
            epochs: epochs,
            batchSize: points.length,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    if (shouldStopTraining) {
                        return;
                    }
                    
                    currentEpoch = epoch + 1;
                    
                    // Get weights
                    const weights = model.getWeights();
                    const mNormalized = weights[0].dataSync()[0];
                    const bNormalized = weights[1].dataSync()[0];
                    
                    // Denormalize to get actual m and b
                    // y = m*x + b (normalized)
                    // y_norm = (y - yMin) / yRange = m_norm * (x - xMin) / xRange + b_norm
                    // y = m_norm * (yRange / xRange) * (x - xMin) + b_norm * yRange + yMin
                    // y = m_norm * (yRange / xRange) * x - m_norm * (yRange / xRange) * xMin + b_norm * yRange + yMin
                    const m = mNormalized * (yRange / xRange);
                    const b = bNormalized * yRange + yMin - m * xMin;
                    
                    // Update line in real-time
                    updateLineFromTraining(m, b);
                    
                    // Update status
                    trainingStatus.textContent = `Epoch ${currentEpoch}/${epochs} - Loss: ${logs.loss.toFixed(4)}`;
                    trainingStatus.style.color = '#667eea';
                    
                    // Small delay to allow UI to update
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        });

        if (!shouldStopTraining) {
            // Get final weights
            const weights = model.getWeights();
            const mNormalized = weights[0].dataSync()[0];
            const bNormalized = weights[1].dataSync()[0];
            
            const m = mNormalized * (yRange / xRange);
            const b = bNormalized * yRange + yMin - m * xMin;
            
            updateLineFromTraining(m, b);
            trainingStatus.textContent = `Training complete! Final loss: ${calculateLoss().mse.toFixed(4)}`;
            trainingStatus.style.color = '#51cf66';
        } else {
            trainingStatus.textContent = 'Training stopped';
            trainingStatus.style.color = '#ff6b6b';
        }

        // Clean up
        xs.dispose();
        ys.dispose();
        model.dispose();

    } catch (error) {
        console.error('Training error:', error);
        trainingStatus.textContent = `Error: ${error.message}`;
        trainingStatus.style.color = '#ff6b6b';
    } finally {
        isTraining = false;
        trainBtn.disabled = false;
        stopBtn.style.display = 'none';
        trainingModel = null;
    }
}

// Stop training
function stopTraining() {
    shouldStopTraining = true;
    if (trainingModel) {
        // Training will stop on next epoch
    }
}

// Event listeners for training
trainBtn.addEventListener('click', trainModel);
stopBtn.addEventListener('click', stopTraining);

// Initial setup
updateHeaders();
draw();

