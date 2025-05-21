// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MetricContract {
    struct Metric {
        string containerId;
        uint256 memoryMB;
        uint256 cpuUsage;
        uint256 timestamp;
    }

    Metric[] public metrics;

    function recordMetric(
        string memory containerId,
        uint256 memoryMB,
        uint256 cpuUsage,
        uint256 timestamp
    ) public {
        metrics.push(Metric(containerId, memoryMB, cpuUsage, timestamp));
    }

    function getMetricCount() public view returns (uint256) {
        return metrics.length;
    }

    function getMetric(uint256 index) public view returns (
        string memory containerId,
        uint256 memoryMB,
        uint256 cpuUsage,
        uint256 timestamp
    ) {
        require(index < metrics.length, "Index out of bounds");
        Metric storage m = metrics[index];
        return (m.containerId, m.memoryMB, m.cpuUsage, m.timestamp);
    }
} 