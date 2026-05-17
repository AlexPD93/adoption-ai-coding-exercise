interface UseCaseResponse {
    id: string
    title: string;
    body: string;
    ai_tool: string;
    time_saved_minutes: number;
}

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

export type { UseCaseResponse, ToolStats, StatsResponse, ErrorResponse };