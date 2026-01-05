export interface Duel {
    challenger: {
        id: string;
        score: number | null;
        messageUrl: string | null;
    };
    opponent: {
        id: string;
        score: number | null;
        messageUrl: string | null;
    }
    channelId: string;
    messageId: string;
};
