interface ToolStats {
    aiTool: string;
    totalTimeSaved: number;
}

interface StatsResponse {
    overallTotalTimeSaved: number;
    timeSavedPerTool: ToolStats[];
}

export type { ToolStats, StatsResponse };