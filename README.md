# Linear Regression Learning Tool

An interactive web application for learning and visualizing linear regression. This tool allows users to input data points, manually adjust regression lines, and train machine learning models in real-time using TensorFlow.js.

![Made with ♥ by Aksa Rose](https://img.shields.io/badge/Made%20with%20%E2%99%A5%20by-Aksa%20Rose-red)

## Features

### 📊 Interactive Data Visualization
- **Graph Canvas**: Visual representation of data points and regression line
- **Real-time Updates**: See changes instantly as you adjust parameters
- **Distance Visualization**: Red dashed lines show the distance from each point to the regression line
- **Grid System**: Clean coordinate grid with labeled axes

### 📝 Data Management
- **Table Input**: Enter data points via an editable table
- **Customizable Headers**: Set custom column names (e.g., "Temperature", "Sales")
- **Dynamic Rows**: Add or remove data points as needed
- **Input Validation**: Only valid numeric values are plotted

### 🎛️ Manual Control
- **Slope Slider**: Adjust the slope (m) from -5 to 5
- **Intercept Slider**: Adjust the intercept (b) from -10 to 10
- **Real-time Feedback**: See MSE and SSE update as you adjust the line
- **Equation Display**: View the current line equation

### 🤖 Machine Learning Training
- **TensorFlow.js Integration**: Train models directly in the browser
- **Customizable Epochs**: Set the number of training iterations (1-1000)
- **Learning Rate Control**: Adjust learning rate (0.001-1)
- **Real-time Training**: Watch the line update after each epoch
- **Smart Initialization**: Training starts from current m and b values
- **Training Status**: Monitor training progress and loss values

### 📈 Loss Metrics
- **Mean Squared Error (MSE)**: Average of squared distances
- **Sum of Squared Errors (SSE)**: Total squared error
- **Live Updates**: Metrics update in real-time

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for TensorFlow.js CDN)

### Installation

1. Clone or download this repository:
```bash
git clone <repository-url>
cd Linear-regression
```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

## Usage Guide

### Adding Data Points

1. **Enter Data**: Type x and y values in the table on the right side
2. **Add More Points**: Click the "+ Add" button to add new rows
3. **Remove Points**: Click "Del" on any row to remove it
4. **Customize Headers**: Change the X and Y column headers to match your data

### Manual Line Adjustment

1. **Use Sliders**: Adjust the "Slope (m)" and "Intercept (b)" sliders
2. **Observe Changes**: Watch the line move on the graph
3. **Check Metrics**: Monitor MSE and SSE values to minimize loss
4. **Distance Lines**: Red dashed lines show how far each point is from the line

### Training a Model

1. **Enter Data Points**: Add at least 2 data points to the table
2. **Set Parameters**:
   - **Epochs**: Number of training iterations (default: 100)
   - **Learning Rate**: How fast the model learns (default: 0.01)
3. **Start Training**: Click "Train Model"
4. **Watch Progress**: 
   - The line updates in real-time after each epoch
   - Training status shows current epoch and loss
   - Metrics update automatically
5. **Stop Training**: Click "Stop Training" to halt at any time

### Understanding the Results

- **MSE (Mean Squared Error)**: Lower is better. Represents average prediction error
- **SSE (Sum of Squared Errors)**: Lower is better. Total prediction error
- **Equation**: Shows the current line in the form `y = mx + b`
- **Distance Lines**: Shorter red lines indicate better fit

## Technical Details

### Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with shadcn UI-inspired design system
- **JavaScript (ES6+)**: Core functionality and interactivity
- **TensorFlow.js**: Machine learning model training
- **Canvas API**: Graph rendering and visualization

### Architecture

```
Linear-regression/
├── index.html          # Main HTML structure
├── style.css           # Styling and theme
├── script.js            # Core functionality
└── README.md           # Documentation
```

### Key Functions

- **`drawGrid()`**: Renders the coordinate grid
- **`drawLine()`**: Draws the regression line
- **`drawPoints()`**: Renders data points
- **`drawDistances()`**: Shows error distances
- **`calculateLoss()`**: Computes MSE and SSE
- **`trainModel()`**: Trains the TensorFlow.js model
- **`updateLineFromTraining()`**: Updates line from model weights

### Color Scheme

The application uses a shadcn UI-inspired color palette:
- **Primary**: Dark slate for main elements
- **Background**: Pure white
- **Borders**: Light gray (hsl(214.3 31.8% 91.4%))
- **Destructive**: Red for errors and delete actions
- **Muted**: Light gray for secondary text

## Educational Use Cases

### For Students
- Visualize how linear regression works
- Understand the relationship between slope and intercept
- See how loss functions behave
- Compare manual adjustment vs. machine learning

### For Teachers
- Interactive demonstrations in class
- Show real-time model training
- Explain gradient descent visually
- Demonstrate overfitting and underfitting concepts

### For Developers
- Learn TensorFlow.js basics
- Understand linear regression implementation
- See real-time model updates
- Study loss function optimization

## Tips for Best Results

1. **Start with Manual Adjustment**: Get a feel for the data first
2. **Use Training for Fine-tuning**: Let the model refine your initial guess
3. **Adjust Learning Rate**: 
   - Too high: Model might overshoot
   - Too low: Training takes longer
4. **Monitor Loss**: Watch for convergence (loss stops decreasing)
5. **Try Different Epochs**: More epochs don't always mean better results

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

## Known Limitations

- Requires at least 2 data points for training
- Canvas rendering may be slower with many points (>100)
- Training performance depends on browser and device
- Large epoch counts may take time to complete

## Future Enhancements

Potential improvements for future versions:
- [ ] Export/import data functionality
- [ ] Multiple regression lines comparison
- [ ] Polynomial regression support
- [ ] Data point dragging on graph
- [ ] Save/load model weights
- [ ] Additional loss functions (MAE, RMSE)
- [ ] Batch size configuration
- [ ] Learning rate scheduling

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available for educational purposes.

## Credits

**Made with ♥ by Aksa Rose**

Special thanks to:
- TensorFlow.js team for the amazing ML library
- shadcn UI for design inspiration
- The open-source community

## Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure you have an internet connection (for TensorFlow.js)
3. Verify you have at least 2 data points before training
4. Try refreshing the page if something seems stuck

---

**Happy Learning! 📚✨**

