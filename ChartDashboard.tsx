import { useState } from "react";
import "./ChartDashboard.css";

function ChartDashboard() {
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(
        "filters",
    );

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo">
                        <span className="logo-icon">📊</span>
                        <span className="logo-text">Chart Analytics</span>
                    </div>
                    <nav className="header-nav">
                        <button className="nav-item active">Live View</button>
                        <button className="nav-item">History</button>
                        <button className="nav-item">Reports</button>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        <span>Live</span>
                    </div>
                    <button className="header-btn">Settings</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Chart Area */}
                <div
                    className={`chart-area ${isPanelCollapsed ? "expanded" : ""}`}
                >
                    <div className="chart-container">
                        <div className="chart-placeholder">
                            <div className="chart-overlay-info">
                                <div className="info-card">
                                    <span className="info-label">
                                        Total Records
                                    </span>
                                    <span className="info-value">1,247</span>
                                </div>
                                <div className="info-card">
                                    <span className="info-label">Active</span>
                                    <span className="info-value">342</span>
                                </div>
                                <div className="info-card">
                                    <span className="info-label">
                                        Update Rate
                                    </span>
                                    <span className="info-value">2.5s</span>
                                </div>
                            </div>
                            {/* Chart will be rendered here */}
                            <div className="chart-content">
                                <p className="chart-placeholder-text">
                                    Chart Display Area
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="bottom-info-bar">
                        <div className="info-item">
                            <span className="info-icon">🕐</span>
                            <span>Last Update: 2s ago</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <span>Zoom: 100%</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">⚡</span>
                            <span>Performance: Good</span>
                        </div>
                    </div>
                </div>

                {/* Config Panel */}
                <div
                    className={`config-panel ${isPanelCollapsed ? "collapsed" : ""}`}
                >
                    <div className="panel-header">
                        <h2>Configuration</h2>
                        <button
                            className="collapse-btn"
                            onClick={() =>
                                setIsPanelCollapsed(!isPanelCollapsed)
                            }
                        >
                            {isPanelCollapsed ? "◀" : "▶"}
                        </button>
                    </div>

                    {!isPanelCollapsed && (
                        <div className="panel-content">
                            {/* Filters Section */}
                            <div className="panel-section">
                                <div
                                    className="section-header"
                                    onClick={() => toggleSection("filters")}
                                >
                                    <span>Filters</span>
                                    <span className="section-toggle">
                                        {activeSection === "filters"
                                            ? "−"
                                            : "+"}
                                    </span>
                                </div>
                                {activeSection === "filters" && (
                                    <div className="section-content">
                                        <div className="control-group">
                                            <label>Date Range</label>
                                            <select className="control-input">
                                                <option>Last 24 Hours</option>
                                                <option>Last 7 Days</option>
                                                <option>Last 30 Days</option>
                                                <option>Custom</option>
                                            </select>
                                        </div>
                                        <div className="control-group">
                                            <label>Category</label>
                                            <select className="control-input">
                                                <option>All Categories</option>
                                                <option>Category A</option>
                                                <option>Category B</option>
                                                <option>Category C</option>
                                            </select>
                                        </div>
                                        <div className="control-group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                />
                                                <span>Show Active Only</span>
                                            </label>
                                        </div>
                                        <div className="control-group">
                                            <label>
                                                <input type="checkbox" />
                                                <span>Include Historical</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Display Options Section */}
                            <div className="panel-section">
                                <div
                                    className="section-header"
                                    onClick={() => toggleSection("display")}
                                >
                                    <span>Display Options</span>
                                    <span className="section-toggle">
                                        {activeSection === "display"
                                            ? "−"
                                            : "+"}
                                    </span>
                                </div>
                                {activeSection === "display" && (
                                    <div className="section-content">
                                        <div className="control-group">
                                            <label>Chart Type</label>
                                            <select className="control-input">
                                                <option>Line Chart</option>
                                                <option>Bar Chart</option>
                                                <option>Scatter Plot</option>
                                                <option>Heat Map</option>
                                            </select>
                                        </div>
                                        <div className="control-group">
                                            <label>Color Scheme</label>
                                            <select className="control-input">
                                                <option>Default</option>
                                                <option>High Contrast</option>
                                                <option>Monochrome</option>
                                                <option>Custom</option>
                                            </select>
                                        </div>
                                        <div className="control-group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                />
                                                <span>Show Grid</span>
                                            </label>
                                        </div>
                                        <div className="control-group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                />
                                                <span>Show Legend</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Data Sources Section */}
                            <div className="panel-section">
                                <div
                                    className="section-header"
                                    onClick={() => toggleSection("sources")}
                                >
                                    <span>Data Sources</span>
                                    <span className="section-toggle">
                                        {activeSection === "sources"
                                            ? "−"
                                            : "+"}
                                    </span>
                                </div>
                                {activeSection === "sources" && (
                                    <div className="section-content">
                                        <div className="source-item">
                                            <div className="source-status active"></div>
                                            <div className="source-info">
                                                <div className="source-name">
                                                    Primary Feed
                                                </div>
                                                <div className="source-meta">
                                                    Connected • 1.2k/s
                                                </div>
                                            </div>
                                        </div>
                                        <div className="source-item">
                                            <div className="source-status active"></div>
                                            <div className="source-info">
                                                <div className="source-name">
                                                    Secondary Feed
                                                </div>
                                                <div className="source-meta">
                                                    Connected • 0.8k/s
                                                </div>
                                            </div>
                                        </div>
                                        <div className="source-item">
                                            <div className="source-status inactive"></div>
                                            <div className="source-info">
                                                <div className="source-name">
                                                    Backup Feed
                                                </div>
                                                <div className="source-meta">
                                                    Disconnected
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="panel-actions">
                                <button className="action-btn primary">
                                    Apply Filters
                                </button>
                                <button className="action-btn secondary">
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartDashboard;
