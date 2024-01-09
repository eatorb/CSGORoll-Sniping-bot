export const joinTradesQuery = (tradeId: string, recaptcha: string) => {
    return {
        id: "a9c500f9-b961-40d9-9820-b7841493307b",
        type: "subscribe",
        payload: {
            variables: {
                input: {
                    tradeIds: [tradeId],
                    recaptcha: recaptcha
                },
                hasCompliedToAntiRWT: true
            }
        },
        extensions: {},
        operationName: "JoinTrades",
        query: `mutation JoinTrades($input: JoinTradesInput!) {
            joinTrades(input: $input) {
                trades {
                    id
                    status
                    totalValue
                    updatedAt
                    expiresAt
                    withdrawer {
                        id
                        steamId
                        avatar
                        displayName
                        steamDisplayName
                        __typename
                    }
                    __typename
                }
                __typename
            }
        }`
    };
};
