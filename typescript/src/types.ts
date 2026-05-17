interface UseCaseResponse {
    id: string
    title: string;
    body: string;
    aiTool: string;
    timeSavedMinutes: number;
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