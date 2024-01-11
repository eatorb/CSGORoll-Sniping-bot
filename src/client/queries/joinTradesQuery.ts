export const joinTradesQuery = (tradeId: string, recaptcha: string) => {
    return {
        id: "1c9e82fc-afd9-4164-abe7-903df10a0d4c",
        type: "subscribe",
        payload: {
            variables: {
                input: {
                    tradeIds: [tradeId],
                    recaptcha: recaptcha,
                    hasCompliedToAntiRWT: true
                }
            },
            extensions: {},
            operationName: "JoinTrades",
            query: "mutation JoinTrades($input: JoinTradesInput!) {\n  joinTrades(input: $input) {\n    trades {\n      id\n      status\n      totalValue\n      updatedAt\n      expiresAt\n      withdrawer {\n        id\n        steamId\n        avatar\n        displayName\n        steamDisplayName\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
        }
    };
};
