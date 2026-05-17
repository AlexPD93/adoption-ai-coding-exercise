interface ToolStats {
    aiTool: string;
    totalTimeSaved: number;
}

interface StatsResponse {
    overallTotalTimeSaved: number;
    timeSavedPerTool: ToolStats[];
}

interface ErrorResponse {
    error: string;
}

export type { ToolStats, StatsResponse, ErrorResponse };